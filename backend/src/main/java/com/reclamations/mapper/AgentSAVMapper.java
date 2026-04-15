package com.reclamations.mapper;

import com.reclamations.dto.AgentSAVDTO;
import com.reclamations.entity.AgentSAV;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface AgentSAVMapper {
    AgentSAVDTO toDTO(AgentSAV agent);
    AgentSAV toEntity(AgentSAVDTO dto);
    void updateFromDTO(AgentSAVDTO dto, @MappingTarget AgentSAV agent);
}
