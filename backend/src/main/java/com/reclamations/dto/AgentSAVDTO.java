package com.reclamations.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AgentSAVDTO {
    private Long id;

    @NotBlank(message = "Le nom est obligatoire")
    private String nom;

    private String competence;
}
