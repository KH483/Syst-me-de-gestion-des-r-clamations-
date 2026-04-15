package com.reclamations.dto;

import com.reclamations.entity.ActionType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class SuiviReclamationDTO {
    private Long id;

    @NotBlank(message = "Le message est obligatoire")
    private String message;

    @NotNull(message = "La réclamation est obligatoire")
    private Long reclamationId;

    private Long employeId;
    private String employeNom;

    @NotNull(message = "L'action est obligatoire")
    private ActionType action;

    private LocalDate date;
}
