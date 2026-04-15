package com.reclamations.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "reclamations")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Reclamation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "client_id", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Client client;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "agent_id")
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private AgentSAV agent;

    @NotBlank
    private String produit;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private StatutReclamation statut = StatutReclamation.EN_ATTENTE;

    @NotBlank
    @Column(columnDefinition = "TEXT")
    private String description;

    @Builder.Default
    private LocalDate date = LocalDate.now();

    @Min(1) @Max(5)
    private Integer note;

    @OneToMany(mappedBy = "reclamation", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private List<SuiviReclamation> suivis;
}
