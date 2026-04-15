package com.reclamations.dto;

import lombok.Data;

import java.util.Map;

@Data
public class StatistiquesDTO {
    private Map<String, Long> reclamationsParStatut;
    private Double tauxSatisfaction;
    private Long totalReclamations;
    private Long reclamationsAvecNote;
}
