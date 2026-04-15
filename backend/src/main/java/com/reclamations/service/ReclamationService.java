package com.reclamations.service;

import com.reclamations.dto.ReclamationDTO;
import com.reclamations.dto.StatistiquesDTO;
import com.reclamations.entity.*;
import com.reclamations.exception.ResourceNotFoundException;
import com.reclamations.mapper.ReclamationMapper;
import com.reclamations.repository.ClientRepository;
import com.reclamations.repository.ReclamationRepository;
import com.reclamations.repository.SuiviReclamationRepository;
import com.reclamations.repository.UserRepository;
import com.reclamations.repository.AgentSAVRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Transactional
public class ReclamationService {

    private final ReclamationRepository reclamationRepository;
    private final ClientRepository clientRepository;
    private final AgentSAVService agentService;
    private final ReclamationMapper reclamationMapper;
    private final UserRepository userRepository;
    private final SuiviReclamationRepository suiviReclamationRepository;
    private final AgentSAVRepository agentRepository;

    // ── Auth helpers ──────────────────────────────────────────────────────────

    private String getCurrentUsername() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }

    private boolean isCurrentUserAgent() {
        return SecurityContextHolder.getContext().getAuthentication().getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_AGENT_SAV"));
    }

    private Client getCurrentClient() {
        String username = getCurrentUsername();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur non trouvé"));
        return clientRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Client non trouvé pour l'utilisateur: " + username));
    }

    // ── CRUD ──────────────────────────────────────────────────────────────────

    public Page<ReclamationDTO> findAll(Pageable pageable) {
        if (isCurrentUserAgent()) {
            return reclamationRepository.findAll(pageable).map(reclamationMapper::toDTO);
        }
        // CLIENT: return only their own reclamations
        Client client = getCurrentClient();
        return reclamationRepository.findByClientUserId(client.getUser().getId(), pageable)
                .map(reclamationMapper::toDTO);
    }

    public Page<ReclamationDTO> findByStatut(StatutReclamation statut, Pageable pageable) {
        return reclamationRepository.findByStatut(statut, pageable).map(reclamationMapper::toDTO);
    }

    public Page<ReclamationDTO> findByClient(Long clientId, Pageable pageable) {
        return reclamationRepository.findByClientId(clientId, pageable).map(reclamationMapper::toDTO);
    }

    public Page<ReclamationDTO> findByAgent(Long agentId, Pageable pageable) {
        return reclamationRepository.findByAgentId(agentId, pageable).map(reclamationMapper::toDTO);
    }

    public ReclamationDTO findById(Long id) {
        Reclamation reclamation = reclamationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Réclamation non trouvée avec l'id: " + id));
        if (!isCurrentUserAgent()) {
            Client client = getCurrentClient();
            if (!reclamation.getClient().getId().equals(client.getId())) {
                throw new AccessDeniedException("Accès refusé");
            }
        }
        return reclamationMapper.toDTO(reclamation);
    }

    public ReclamationDTO create(ReclamationDTO dto) {
        Reclamation reclamation = reclamationMapper.toEntity(dto);
        Client client;
        if (isCurrentUserAgent()) {
            client = clientRepository.findById(dto.getClientId())
                    .orElseThrow(() -> new ResourceNotFoundException("Client non trouvé avec l'id: " + dto.getClientId()));
        } else {
            client = getCurrentClient();
        }
        reclamation.setClient(client);
        reclamation.setStatut(StatutReclamation.EN_ATTENTE);
        reclamation.setDate(java.time.LocalDate.now());
        return reclamationMapper.toDTO(reclamationRepository.save(reclamation));
    }

    public ReclamationDTO update(Long id, ReclamationDTO dto) {
        Reclamation reclamation = reclamationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Réclamation non trouvée avec l'id: " + id));
        if (!isCurrentUserAgent()) {
            Client client = getCurrentClient();
            if (!reclamation.getClient().getId().equals(client.getId())) {
                throw new AccessDeniedException("Accès refusé");
            }
            if (reclamation.getStatut() != StatutReclamation.EN_ATTENTE) {
                throw new IllegalStateException("Modification impossible : la réclamation est en cours de traitement ou traitée.");
            }
        }
        reclamationMapper.updateFromDTO(dto, reclamation);
        return reclamationMapper.toDTO(reclamationRepository.save(reclamation));
    }

    public ReclamationDTO affecter(Long reclamationId, Long agentId) {
        Reclamation reclamation = reclamationRepository.findById(reclamationId)
                .orElseThrow(() -> new ResourceNotFoundException("Réclamation non trouvée avec l'id: " + reclamationId));

        // Check if already assigned to a different agent
        if (reclamation.getAgent() != null && !reclamation.getAgent().getId().equals(agentId)) {
            throw new IllegalStateException("Réclamation déjà assignée à un autre agent.");
        }

        AgentSAV agent = agentService.findEntityById(agentId);
        reclamation.setAgent(agent);

        // Auto-transition to EN_COURS
        reclamation.setStatut(StatutReclamation.EN_COURS);

        // Create SuiviReclamation for the assignment
        SuiviReclamation suivi = SuiviReclamation.builder()
                .reclamation(reclamation)
                .employe(agent)
                .action(ActionType.STATUS_CHANGE)
                .message("Réclamation assignée à l'agent " + agent.getNom() + " et mise en cours.")
                .build();
        suiviReclamationRepository.save(suivi);

        return reclamationMapper.toDTO(reclamationRepository.save(reclamation));
    }

    public ReclamationDTO changerStatut(Long id, StatutReclamation statut) {
        Reclamation reclamation = reclamationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Réclamation non trouvée avec l'id: " + id));

        StatutReclamation current = reclamation.getStatut();
        boolean validTransition = (current == StatutReclamation.EN_ATTENTE && statut == StatutReclamation.EN_COURS)
                || (current == StatutReclamation.EN_COURS && statut == StatutReclamation.TRAITEE)
                || (current == StatutReclamation.EN_ATTENTE && statut == StatutReclamation.TRAITEE);

        if (!validTransition) {
            throw new IllegalStateException("Transition invalide : " + current + " → " + statut);
        }

        reclamation.setStatut(statut);

        // Assign current agent if not already assigned
        if (reclamation.getAgent() == null) {
            String username = getCurrentUsername();
            agentRepository.findByUserUsername(username).ifPresent(reclamation::setAgent);
        }

        // Create SuiviReclamation for status change
        AgentSAV agent = reclamation.getAgent();
        SuiviReclamation suivi = SuiviReclamation.builder()
                .reclamation(reclamation)
                .employe(agent)
                .action(ActionType.STATUS_CHANGE)
                .message("Statut changé de " + current + " à " + statut)
                .build();
        suiviReclamationRepository.save(suivi);

        return reclamationMapper.toDTO(reclamationRepository.save(reclamation));
    }

    public ReclamationDTO noter(Long id, Integer note) {
        Reclamation reclamation = reclamationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Réclamation non trouvée avec l'id: " + id));

        // Ownership check
        Client client = getCurrentClient();
        if (!reclamation.getClient().getId().equals(client.getId())) {
            throw new AccessDeniedException("Accès refusé");
        }

        // Status gate
        if (reclamation.getStatut() != StatutReclamation.TRAITEE) {
            throw new IllegalStateException("Notation impossible : la réclamation n'est pas encore traitée.");
        }

        // Note range validation
        if (note < 1 || note > 5) {
            throw new IllegalArgumentException("La note doit être entre 1 et 5.");
        }

        reclamation.setNote(note);
        return reclamationMapper.toDTO(reclamationRepository.save(reclamation));
    }

    public void delete(Long id) {
        Reclamation reclamation = reclamationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Réclamation non trouvée avec l'id: " + id));
        if (!isCurrentUserAgent()) {
            Client client = getCurrentClient();
            if (!reclamation.getClient().getId().equals(client.getId())) {
                throw new AccessDeniedException("Accès refusé");
            }
            if (reclamation.getStatut() != StatutReclamation.EN_ATTENTE) {
                throw new IllegalStateException("Suppression impossible : la réclamation est en cours de traitement ou traitée.");
            }
        }
        reclamationRepository.deleteById(id);
    }

    public StatistiquesDTO getStatistiques() {
        StatistiquesDTO stats = new StatistiquesDTO();

        List<Object[]> countByStatut = reclamationRepository.countByStatut();
        Map<String, Long> parStatut = new HashMap<>();
        for (Object[] row : countByStatut) {
            parStatut.put(row[0].toString(), (Long) row[1]);
        }
        stats.setReclamationsParStatut(parStatut);

        Double avg = reclamationRepository.averageNote();
        stats.setTauxSatisfaction(avg != null ? (avg / 5.0) * 100 : 0.0);
        stats.setTotalReclamations(reclamationRepository.count());
        stats.setReclamationsAvecNote(reclamationRepository.countWithNote());

        return stats;
    }
}
