package com.reclamations.dto;

import com.reclamations.entity.StatutReclamation;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.time.LocalDate;

@Data
public class ReclamationDTO {
    private Long id;

    @NotNull(message = "Le client est obligatoire")
    private Long clientId;

    private String clientNom;

    private Long agentId;
    private String agentNom;

    @NotBlank(message = "Le produit est obligatoire")
    private String produit;

    private StatutReclamation statut;

    @NotBlank(message = "La description est obligatoire")
    private String description;

    private LocalDate date;

    @Min(1) @Max(5)
    private Integer note;
}
