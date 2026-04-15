package com.reclamations.mapper;

import com.reclamations.dto.ReclamationDTO;
import com.reclamations.entity.Reclamation;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface ReclamationMapper {

    @Mapping(source = "client.id", target = "clientId")
    @Mapping(source = "client.nom", target = "clientNom")
    @Mapping(source = "agent.id", target = "agentId")
    @Mapping(source = "agent.nom", target = "agentNom")
    ReclamationDTO toDTO(Reclamation reclamation);

    @Mapping(target = "client", ignore = true)
    @Mapping(target = "agent", ignore = true)
    @Mapping(target = "suivis", ignore = true)
    Reclamation toEntity(ReclamationDTO dto);

    @Mapping(target = "client", ignore = true)
    @Mapping(target = "agent", ignore = true)
    @Mapping(target = "suivis", ignore = true)
    void updateFromDTO(ReclamationDTO dto, @MappingTarget Reclamation reclamation);
}
