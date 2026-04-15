import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReclamationService } from '../../services/reclamation.service';
import { Reclamation } from '../../models/reclamation.model';

@Component({
  selector: 'app-client-reclamation-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div>
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h4 class="fw-bold">📋 Mes réclamations</h4>
        <a routerLink="/client/reclamations/new" class="btn btn-primary">+ Nouvelle réclamation</a>
      </div>
      <div class="card">
        <div class="table-responsive">
          <table class="table table-hover mb-0">
            <thead class="table-light">
              <tr><th>#</th><th>Produit</th><th>Statut</th><th>Date</th><th>Note</th><th>Actions</th></tr>
            </thead>
            <tbody>
              <tr *ngFor="let r of reclamations">
                <td>{{ r.id }}</td>
                <td>{{ r.produit }}</td>
                <td><span class="badge" [class]="'badge-' + r.statut">{{ r.statut }}</span></td>
                <td>{{ r.date | date:'dd/MM/yyyy' }}</td>
                <td>{{ r.note ? '⭐'.repeat(r.note) : '—' }}</td>
                <td>
                  <div class="d-flex gap-1">
                    <a [routerLink]="['/client/reclamations', r.id]" class="btn btn-sm btn-outline-primary">👁</a>
                    <a *ngIf="r.statut === 'EN_ATTENTE'" [routerLink]="['/client/reclamations', r.id, 'edit']" class="btn btn-sm btn-outline-secondary">✏️</a>
                    <button *ngIf="r.statut === 'EN_ATTENTE'" class="btn btn-sm btn-outline-danger" (click)="delete(r.id!)">🗑</button>
                    <a *ngIf="r.statut === 'TRAITEE' && !r.note" [routerLink]="['/client/reclamations', r.id]" class="btn btn-sm btn-warning">⭐ Noter</a>
                  </div>
                </td>
              </tr>
              <tr *ngIf="reclamations.length === 0">
                <td colspan="6" class="text-center text-muted py-4">Aucune réclamation</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class ClientReclamationListComponent implements OnInit {
  reclamations: Reclamation[] = [];

  constructor(private reclamationService: ReclamationService) {}

  ngOnInit(): void {
    this.reclamationService.getAll(0, 100).subscribe(data => this.reclamations = data.content);
  }

  delete(id: number): void {
    if (confirm('Supprimer cette réclamation ?')) {
      this.reclamationService.delete(id).subscribe({
        next: () => this.reclamations = this.reclamations.filter(r => r.id !== id),
        error: (err) => alert(err.error?.message || 'Suppression impossible')
      });
    }
  }
}
