package com.reclamations.dto;

import lombok.Data;

@Data
public class AgentStatistiquesDTO {
    private Long totalAssignees;
    private Long traitees;
    private Long enCours;
    private Long enAttente;
    private Double moyenneNote;
}
