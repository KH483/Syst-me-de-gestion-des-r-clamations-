import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ReclamationService } from '../../services/reclamation.service';
import { AgentService } from '../../services/agent.service';
import { Reclamation, StatutReclamation } from '../../models/reclamation.model';

@Component({
  selector: 'app-agent-reclamation-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div>
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h4 class="fw-bold">📋 Toutes les réclamations</h4>
      </div>

      <!-- Filters -->
      <div class="card p-3 mb-4">
        <div class="row g-2">
          <div class="col-md-4">
            <select class="form-select" [(ngModel)]="filterStatut" (change)="load()">
              <option value="">Tous les statuts</option>
              <option value="EN_ATTENTE">En attente</option>
              <option value="EN_COURS">En cours</option>
              <option value="TRAITEE">Traitée</option>
            </select>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="table-responsive">
          <table class="table table-hover mb-0">
            <thead class="table-light">
              <tr><th>#</th><th>Client</th><th>Produit</th><th>Statut</th><th>Agent</th><th>Date</th><th>Actions</th></tr>
            </thead>
            <tbody>
              <tr *ngFor="let r of reclamations">
                <td>{{ r.id }}</td>
                <td>{{ r.clientNom }}</td>
                <td>{{ r.produit }}</td>
                <td><span class="badge" [class]="'badge-' + r.statut">{{ r.statut }}</span></td>
                <td>{{ r.agentNom || '—' }}</td>
                <td>{{ r.date | date:'dd/MM/yyyy' }}</td>
                <td>
                  <div class="d-flex gap-1">
                    <a [routerLink]="['/agent/reclamations', r.id]" class="btn btn-sm btn-outline-primary">👁</a>
                    <button *ngIf="r.statut === 'EN_ATTENTE' && !r.agentId && agentId"
                            class="btn btn-sm btn-outline-success"
                            (click)="affecter(r.id!)">
                      ✋ Prendre
                    </button>
                    <button class="btn btn-sm btn-outline-danger" (click)="delete(r.id!)">🗑</button>
                  </div>
                </td>
              </tr>
              <tr *ngIf="reclamations.length === 0">
                <td colspan="7" class="text-center text-muted py-4">Aucune réclamation</td>
              </tr>
            </tbody>
          </table>
        </div>
        <!-- Pagination -->
        <div class="d-flex justify-content-between align-items-center p-3" *ngIf="totalPages > 1">
          <small class="text-muted">{{ totalElements }} réclamation(s)</small>
          <div class="d-flex gap-1">
            <button class="btn btn-sm btn-outline-secondary" [disabled]="page === 0" (click)="changePage(page - 1)">‹</button>
            <span class="btn btn-sm">{{ page + 1 }} / {{ totalPages }}</span>
            <button class="btn btn-sm btn-outline-secondary" [disabled]="page >= totalPages - 1" (click)="changePage(page + 1)">›</button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AgentReclamationListComponent implements OnInit {
  reclamations: Reclamation[] = [];
  filterStatut: StatutReclamation | '' = '';
  page = 0; totalPages = 0; totalElements = 0;
  agentId: number | null = null;

  constructor(
    private reclamationService: ReclamationService,
    private agentService: AgentService
  ) {}

  ngOnInit(): void {
    this.load();
    this.agentService.getMe().subscribe(agent => this.agentId = agent.id!);
  }

  load(): void {
    this.reclamationService.getAll(this.page, 10, this.filterStatut || undefined).subscribe(data => {
      this.reclamations = data.content;
      this.totalPages = data.totalPages;
      this.totalElements = data.totalElements;
    });
  }

  changePage(p: number): void { this.page = p; this.load(); }

  affecter(reclamationId: number): void {
    if (!this.agentId) return;
    this.reclamationService.affecter(reclamationId, this.agentId).subscribe({
      next: () => this.load(),
      error: (err) => alert(err.error?.message || 'Erreur lors de l\'affectation')
    });
  }

  delete(id: number): void {
    if (confirm('Supprimer définitivement cette réclamation ?')) {
      this.reclamationService.delete(id).subscribe({
        next: () => this.load(),
        error: (err) => alert(err.error?.message || 'Erreur lors de la suppression')
      });
    }
  }
}
