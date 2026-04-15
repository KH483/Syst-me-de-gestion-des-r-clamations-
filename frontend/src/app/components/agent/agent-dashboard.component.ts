import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReclamationService } from '../../services/reclamation.service';
import { AgentService } from '../../services/agent.service';
import { AuthService } from '../../services/auth.service';
import { Statistiques } from '../../models/auth.model';
import { AgentStatistiques } from '../../models/agent.model';

@Component({
  selector: 'app-agent-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div>
      <h4 class="fw-bold mb-4">📊 Tableau de bord Agent</h4>

      <!-- Global stats -->
      <div class="row g-3 mb-4" *ngIf="globalStats">
        <div class="col-md-3">
          <div class="stat-card bg-primary">
            <div class="fs-2 fw-bold">{{ globalStats.totalReclamations }}</div>
            <div class="opacity-75">Total réclamations</div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="stat-card bg-warning">
            <div class="fs-2 fw-bold">{{ globalStats.reclamationsParStatut['EN_ATTENTE'] || 0 }}</div>
            <div class="opacity-75">En attente</div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="stat-card bg-info">
            <div class="fs-2 fw-bold">{{ globalStats.reclamationsParStatut['EN_COURS'] || 0 }}</div>
            <div class="opacity-75">En cours</div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="stat-card bg-success">
            <div class="fs-2 fw-bold">{{ globalStats.reclamationsParStatut['TRAITEE'] || 0 }}</div>
            <div class="opacity-75">Traitées</div>
          </div>
        </div>
      </div>

      <!-- Satisfaction globale -->
      <div class="card p-4 mb-4" *ngIf="globalStats">
        <h6 class="fw-bold mb-2">⭐ Satisfaction globale</h6>
        <div class="d-flex align-items-center gap-3">
          <div class="fs-3 fw-bold text-warning">
            {{ (globalStats.tauxSatisfaction / 20) | number:'1.1-1' }}/5
          </div>
          <div class="flex-grow-1">
            <div class="progress" style="height: 10px;">
              <div class="progress-bar bg-warning" [style.width.%]="globalStats.tauxSatisfaction"></div>
            </div>
            <small class="text-muted">Basé sur {{ globalStats.reclamationsAvecNote }} évaluation(s)</small>
          </div>
        </div>
      </div>

      <!-- My stats -->
      <div class="row g-3" *ngIf="myStats">
        <div class="col-md-6">
          <div class="card p-4">
            <h6 class="fw-bold mb-3">📈 Mes statistiques</h6>
            <div class="row g-2">
              <div class="col-6"><strong>Assignées:</strong> {{ myStats.totalAssignees }}</div>
              <div class="col-6"><strong>Traitées:</strong> {{ myStats.traitees }}</div>
              <div class="col-6"><strong>En cours:</strong> {{ myStats.enCours }}</div>
              <div class="col-6"><strong>En attente:</strong> {{ myStats.enAttente }}</div>
              <div class="col-12 mt-2">
                <strong>Note moyenne:</strong>
                <span *ngIf="myStats.moyenneNote !== null && myStats.moyenneNote !== undefined">
                  {{ myStats.moyenneNote | number:'1.1-1' }}/5
                  <span class="text-warning ms-1">
                    {{ getStars(myStats.moyenneNote) }}
                  </span>
                </span>
                <span *ngIf="myStats.moyenneNote === null || myStats.moyenneNote === undefined" class="text-muted">
                  Aucune évaluation
                </span>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-6">
          <div class="card p-4">
            <h6 class="fw-bold mb-3">⚡ Actions rapides</h6>
            <div class="d-flex flex-column gap-2">
              <a routerLink="/agent/reclamations" class="btn btn-outline-primary">📋 Voir toutes les réclamations</a>
              <a routerLink="/agent/clients" class="btn btn-outline-secondary">👥 Voir les clients</a>
            </div>
          </div>
        </div>
      </div>

      <div *ngIf="!globalStats" class="text-center py-5">
        <div class="spinner-border text-primary"></div>
      </div>
    </div>
  `
})
export class AgentDashboardComponent implements OnInit {
  globalStats: Statistiques | null = null;
  myStats: AgentStatistiques | null = null;
  agentId: number | null = null;

  constructor(
    private reclamationService: ReclamationService,
    private agentService: AgentService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.reclamationService.getStatistiques().subscribe(s => this.globalStats = s);

    this.agentService.getMe().subscribe(agent => {
      this.agentId = agent.id!;
      this.agentService.getStatistiques(this.agentId).subscribe(s => this.myStats = s);
    });
  }

  getStars(note: number): string {
    const full = Math.round(note);
    return '⭐'.repeat(full) + '☆'.repeat(5 - full);
  }
}
