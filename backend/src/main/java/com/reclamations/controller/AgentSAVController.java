package com.reclamations.controller;

import com.reclamations.dto.AgentSAVDTO;
import com.reclamations.dto.AgentStatistiquesDTO;
import com.reclamations.service.AgentSAVService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/agents")
@RequiredArgsConstructor
@PreAuthorize("hasRole('AGENT_SAV')")
@Tag(name = "Agents SAV", description = "Gestion des agents SAV")
public class AgentSAVController {

    private final AgentSAVService agentService;

    @GetMapping
    @Operation(summary = "Lister tous les agents (paginé)")
    public ResponseEntity<Page<AgentSAVDTO>> findAll(Pageable pageable) {
        return ResponseEntity.ok(agentService.findAll(pageable));
    }

    @GetMapping("/all")
    @Operation(summary = "Lister tous les agents sans pagination")
    public ResponseEntity<List<AgentSAVDTO>> findAll() {
        return ResponseEntity.ok(agentService.findAll());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtenir un agent par ID")
    public ResponseEntity<AgentSAVDTO> findById(@PathVariable Long id) {
        return ResponseEntity.ok(agentService.findById(id));
    }

    @PostMapping
    @Operation(summary = "Créer un nouvel agent")
    public ResponseEntity<AgentSAVDTO> create(@Valid @RequestBody AgentSAVDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(agentService.create(dto));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Mettre à jour un agent")
    public ResponseEntity<AgentSAVDTO> update(@PathVariable Long id, @Valid @RequestBody AgentSAVDTO dto) {
        return ResponseEntity.ok(agentService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Supprimer un agent")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        agentService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/statistiques")
    @Operation(summary = "Obtenir les statistiques d'un agent")
    public ResponseEntity<AgentStatistiquesDTO> getStatistiques(@PathVariable Long id) {
        return ResponseEntity.ok(agentService.getStatistiques(id));
    }

    @GetMapping("/me")
    @Operation(summary = "Obtenir l'agent connecté")
    public ResponseEntity<AgentSAVDTO> getMe(Authentication auth) {
        return ResponseEntity.ok(agentService.findByUsername(auth.getName()));
    }
}
