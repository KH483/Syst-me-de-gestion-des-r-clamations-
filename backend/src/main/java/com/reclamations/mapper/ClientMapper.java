package com.reclamations.mapper;

import com.reclamations.dto.ClientDTO;
import com.reclamations.entity.Client;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface ClientMapper {
    ClientDTO toDTO(Client client);

    @Mapping(target = "user", ignore = true)
    Client toEntity(ClientDTO dto);

    @Mapping(target = "user", ignore = true)
    void updateFromDTO(ClientDTO dto, @MappingTarget Client client);
}
