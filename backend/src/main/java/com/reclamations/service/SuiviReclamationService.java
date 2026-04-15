package com.reclamations.service;

import com.reclamations.dto.SuiviReclamationDTO;
import com.reclamations.entity.ActionType;
import com.reclamations.entity.AgentSAV;
import com.reclamations.entity.Reclamation;
import com.reclamations.entity.SuiviReclamation;
import com.reclamations.exception.ResourceNotFoundException;
import com.reclamations.mapper.SuiviReclamationMapper;
import com.reclamations.repository.ReclamationRepository;
import com.reclamations.repository.SuiviReclamationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class SuiviReclamationService {

    private final SuiviReclamationRepository suiviRepository;
    private final ReclamationRepository reclamationRepository;
    private final AgentSAVService agentService;
    private final SuiviReclamationMapper suiviMapper;

    public List<SuiviReclamationDTO> findByReclamation(Long reclamationId) {
        boolean isAgent = SecurityContextHolder.getContext().getAuthentication()
                .getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_AGENT_SAV"));

        return suiviRepository.findByReclamationIdOrderByDateDesc(reclamationId)
                .stream()
                .filter(s -> isAgent || s.getAction() != ActionType.INTERNAL_NOTE)
                .map(suiviMapper::toDTO)
                .collect(Collectors.toList());
    }

    public SuiviReclamationDTO create(SuiviReclamationDTO dto) {
        SuiviReclamation suivi = suiviMapper.toEntity(dto);

        Reclamation reclamation = reclamationRepository.findById(dto.getReclamationId())
                .orElseThrow(() -> new ResourceNotFoundException("Réclamation non trouvée"));
        suivi.setReclamation(reclamation);

        if (dto.getEmployeId() != null) {
            AgentSAV agent = agentService.findEntityById(dto.getEmployeId());
            suivi.setEmploye(agent);
        }

        return suiviMapper.toDTO(suiviRepository.save(suivi));
    }

    public void delete(Long id) {
        if (!suiviRepository.existsById(id)) {
            throw new ResourceNotFoundException("Suivi non trouvé avec l'id: " + id);
        }
        suiviRepository.deleteById(id);
    }
}
