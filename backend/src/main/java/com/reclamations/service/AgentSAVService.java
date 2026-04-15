package com.reclamations.service;

import com.reclamations.dto.AgentSAVDTO;
import com.reclamations.dto.AgentStatistiquesDTO;
import com.reclamations.entity.AgentSAV;
import com.reclamations.entity.StatutReclamation;
import com.reclamations.exception.ResourceNotFoundException;
import com.reclamations.mapper.AgentSAVMapper;
import com.reclamations.repository.AgentSAVRepository;
import com.reclamations.repository.ReclamationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class AgentSAVService {

    private final AgentSAVRepository agentRepository;
    private final AgentSAVMapper agentMapper;
    private final ReclamationRepository reclamationRepository;

    public Page<AgentSAVDTO> findAll(Pageable pageable) {
        return agentRepository.findAll(pageable).map(agentMapper::toDTO);
    }

    public List<AgentSAVDTO> findAll() {
        return agentRepository.findAll().stream()
                .map(agentMapper::toDTO)
                .collect(Collectors.toList());
    }

    public AgentSAVDTO findById(Long id) {
        return agentRepository.findById(id)
                .map(agentMapper::toDTO)
                .orElseThrow(() -> new ResourceNotFoundException("Agent non trouvé avec l'id: " + id));
    }

    public AgentSAV findEntityById(Long id) {
        return agentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Agent non trouvé avec l'id: " + id));
    }

    public AgentSAVDTO create(AgentSAVDTO dto) {
        AgentSAV agent = agentMapper.toEntity(dto);
        return agentMapper.toDTO(agentRepository.save(agent));
    }

    public AgentSAVDTO update(Long id, AgentSAVDTO dto) {
        AgentSAV agent = agentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Agent non trouvé avec l'id: " + id));
        agentMapper.updateFromDTO(dto, agent);
        return agentMapper.toDTO(agentRepository.save(agent));
    }

    public void delete(Long id) {
        if (!agentRepository.existsById(id)) {
            throw new ResourceNotFoundException("Agent non trouvé avec l'id: " + id);
        }
        agentRepository.deleteById(id);
    }

    public AgentStatistiquesDTO getStatistiques(Long agentId) {
        AgentStatistiquesDTO stats = new AgentStatistiquesDTO();
        stats.setTotalAssignees(reclamationRepository.countByAgentId(agentId));
        stats.setTraitees(reclamationRepository.countByAgentIdAndStatut(agentId, StatutReclamation.TRAITEE));
        stats.setEnCours(reclamationRepository.countByAgentIdAndStatut(agentId, StatutReclamation.EN_COURS));
        stats.setEnAttente(reclamationRepository.countByAgentIdAndStatut(agentId, StatutReclamation.EN_ATTENTE));
        stats.setMoyenneNote(reclamationRepository.averageNoteByAgentId(agentId));
        return stats;
    }

    public AgentSAVDTO findByUsername(String username) {
        return agentRepository.findByUserUsername(username)
                .map(agentMapper::toDTO)
                .orElseThrow(() -> new ResourceNotFoundException("Agent non trouvé pour l'utilisateur: " + username));
    }
}
