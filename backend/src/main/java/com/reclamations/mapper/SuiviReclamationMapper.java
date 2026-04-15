package com.reclamations.mapper;

import com.reclamations.dto.SuiviReclamationDTO;
import com.reclamations.entity.SuiviReclamation;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface SuiviReclamationMapper {

    @Mapping(source = "reclamation.id", target = "reclamationId")
    @Mapping(source = "employe.id", target = "employeId")
    @Mapping(source = "employe.nom", target = "employeNom")
    SuiviReclamationDTO toDTO(SuiviReclamation suivi);

    @Mapping(target = "reclamation", ignore = true)
    @Mapping(target = "employe", ignore = true)
    SuiviReclamation toEntity(SuiviReclamationDTO dto);
}
