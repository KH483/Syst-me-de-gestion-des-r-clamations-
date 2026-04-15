package com.reclamations.controller;

import com.reclamations.dto.SuiviReclamationDTO;
import com.reclamations.service.SuiviReclamationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/suivis")
@RequiredArgsConstructor
@Tag(name = "Suivi Réclamations", description = "Historique des actions sur les réclamations")
public class SuiviReclamationController {

    private final SuiviReclamationService suiviService;

    @GetMapping("/reclamation/{reclamationId}")
    @Operation(summary = "Obtenir l'historique d'une réclamation")
    public ResponseEntity<List<SuiviReclamationDTO>> findByReclamation(@PathVariable Long reclamationId) {
        return ResponseEntity.ok(suiviService.findByReclamation(reclamationId));
    }

    @PostMapping
    @Operation(summary = "Ajouter un suivi à une réclamation")
    public ResponseEntity<SuiviReclamationDTO> create(@Valid @RequestBody SuiviReclamationDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(suiviService.create(dto));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Supprimer un suivi")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        suiviService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
