package com.reclamations.controller;

import com.reclamations.dto.ReclamationDTO;
import com.reclamations.dto.StatistiquesDTO;
import com.reclamations.entity.StatutReclamation;
import com.reclamations.service.ReclamationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reclamations")
@RequiredArgsConstructor
@Tag(name = "Réclamations", description = "Gestion des réclamations clients")
public class ReclamationController {

    private final ReclamationService reclamationService;

    @GetMapping
    @Operation(summary = "Lister toutes les réclamations avec filtres optionnels")
    public ResponseEntity<Page<ReclamationDTO>> findAll(
            @RequestParam(required = false) StatutReclamation statut,
            @RequestParam(required = false) Long clientId,
            @RequestParam(required = false) Long agentId,
            Pageable pageable) {

        if (statut != null) return ResponseEntity.ok(reclamationService.findByStatut(statut, pageable));
        if (clientId != null) return ResponseEntity.ok(reclamationService.findByClient(clientId, pageable));
        if (agentId != null) return ResponseEntity.ok(reclamationService.findByAgent(agentId, pageable));
        return ResponseEntity.ok(reclamationService.findAll(pageable));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtenir une réclamation par ID")
    public ResponseEntity<ReclamationDTO> findById(@PathVariable Long id) {
        return ResponseEntity.ok(reclamationService.findById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('CLIENT')")
    @Operation(summary = "Créer une nouvelle réclamation")
    public ResponseEntity<ReclamationDTO> create(@Valid @RequestBody ReclamationDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(reclamationService.create(dto));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Mettre à jour une réclamation")
    public ResponseEntity<ReclamationDTO> update(@PathVariable Long id, @Valid @RequestBody ReclamationDTO dto) {
        return ResponseEntity.ok(reclamationService.update(id, dto));
    }

    @PatchMapping("/{id}/affecter/{agentId}")
    @PreAuthorize("hasRole('AGENT_SAV')")
    @Operation(summary = "Affecter une réclamation à un agent SAV")
    public ResponseEntity<ReclamationDTO> affecter(@PathVariable Long id, @PathVariable Long agentId) {
        return ResponseEntity.ok(reclamationService.affecter(id, agentId));
    }

    @PatchMapping("/{id}/statut")
    @PreAuthorize("hasRole('AGENT_SAV')")
    @Operation(summary = "Changer le statut d'une réclamation")
    public ResponseEntity<ReclamationDTO> changerStatut(@PathVariable Long id,
                                                         @RequestParam StatutReclamation statut) {
        return ResponseEntity.ok(reclamationService.changerStatut(id, statut));
    }

    @PatchMapping("/{id}/noter")
    @PreAuthorize("hasRole('CLIENT')")
    @Operation(summary = "Noter une réclamation traitée")
    public ResponseEntity<ReclamationDTO> noter(@PathVariable Long id, @RequestParam Integer note) {
        return ResponseEntity.ok(reclamationService.noter(id, note));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Supprimer une réclamation")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        reclamationService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/statistiques")
    @Operation(summary = "Obtenir les statistiques des réclamations")
    public ResponseEntity<StatistiquesDTO> getStatistiques() {
        return ResponseEntity.ok(reclamationService.getStatistiques());
    }
}
