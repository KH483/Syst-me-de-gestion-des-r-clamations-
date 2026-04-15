import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReclamationService } from '../../services/reclamation.service';
import { Reclamation } from '../../models/reclamation.model';

@Component({
  selector: 'app-client-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div>
      <h4 class="fw-bold mb-4">📊 Mon tableau de bord</h4>
      <div class="row g-3 mb-4">
        <div class="col-md-3">
          <div class="stat-card bg-primary">
            <div class="fs-2 fw-bold">{{ total }}</div>
            <div class="opacity-75">Total</div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="stat-card bg-warning">
            <div class="fs-2 fw-bold">{{ enAttente }}</div>
            <div class="opacity-75">En attente</div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="stat-card bg-info">
            <div class="fs-2 fw-bold">{{ enCours }}</div>
            <div class="opacity-75">En cours</div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="stat-card bg-success">
            <div class="fs-2 fw-bold">{{ traitees }}</div>
            <div class="opacity-75">Traitées</div>
          </div>
        </div>
      </div>
      <div class="card p-4">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h6 class="fw-bold mb-0">Réclamations récentes</h6>
          <a routerLink="/client/reclamations/new" class="btn btn-primary btn-sm">+ Nouvelle</a>
        </div>
        <div class="table-responsive">
          <table class="table table-hover mb-0">
            <thead class="table-light">
              <tr><th>Produit</th><th>Statut</th><th>Date</th><th></th></tr>
            </thead>
            <tbody>
              <tr *ngFor="let r of reclamations.slice(0, 5)">
                <td>{{ r.produit }}</td>
                <td><span class="badge" [class]="'badge-' + r.statut">{{ r.statut }}</span></td>
                <td>{{ r.date | date:'dd/MM/yyyy' }}</td>
                <td><a [routerLink]="['/client/reclamations', r.id]" class="btn btn-sm btn-outline-primary">Voir</a></td>
              </tr>
              <tr *ngIf="reclamations.length === 0">
                <td colspan="4" class="text-center text-muted py-3">Aucune réclamation</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class ClientDashboardComponent implements OnInit {
  reclamations: Reclamation[] = [];
  total = 0; enAttente = 0; enCours = 0; traitees = 0;

  constructor(private reclamationService: ReclamationService) {}

  ngOnInit(): void {
    this.reclamationService.getAll(0, 100).subscribe(data => {
      this.reclamations = data.content;
      this.total = data.totalElements;
      this.enAttente = this.reclamations.filter(r => r.statut === 'EN_ATTENTE').length;
      this.enCours = this.reclamations.filter(r => r.statut === 'EN_COURS').length;
      this.traitees = this.reclamations.filter(r => r.statut === 'TRAITEE').length;
    });
  }
}
