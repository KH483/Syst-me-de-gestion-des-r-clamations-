package com.reclamations.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "suivis_reclamation")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SuiviReclamation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(columnDefinition = "TEXT")
    private String message;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reclamation_id", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Reclamation reclamation;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employe_id")
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private AgentSAV employe;

    @Enumerated(EnumType.STRING)
    private ActionType action;

    @Builder.Default
    private LocalDate date = LocalDate.now();
}
