import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ReclamationService } from '../../services/reclamation.service';
import { SuiviService } from '../../services/suivi.service';
import { AgentService } from '../../services/agent.service';
import { PdfService } from '../../services/pdf.service';
import { Reclamation, StatutReclamation } from '../../models/reclamation.model';
import { SuiviReclamation } from '../../models/suivi.model';

@Component({
  selector: 'app-agent-reclamation-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div *ngIf="reclamation">
      <div class="d-flex align-items-center gap-2 mb-4">
        <a routerLink="/agent/reclamations" class="btn btn-outline-secondary btn-sm">← Retour</a>
        <h4 class="fw-bold mb-0">Réclamation #{{ reclamation.id }}</h4>
        <span class="badge ms-2" [class]="'badge-' + reclamation.statut">{{ reclamation.statut }}</span>
        <button class="btn btn-outline-danger btn-sm ms-auto" (click)="exportPdf()">🖨️ Imprimer PDF</button>
      </div>

      <div class="row g-4">
        <div class="col-md-8">
          <!-- Details -->
          <div class="card p-4 mb-4">
            <h6 class="fw-bold mb-3">Informations</h6>
            <div class="row g-2">
              <div class="col-6"><strong>Client:</strong> {{ reclamation.clientNom }}</div>
              <div class="col-6"><strong>Produit:</strong> {{ reclamation.produit }}</div>
              <div class="col-6"><strong>Date:</strong> {{ reclamation.date | date:'dd/MM/yyyy' }}</div>
              <div class="col-6"><strong>Agent:</strong> {{ reclamation.agentNom || 'Non assigné' }}</div>
              <div class="col-12 mt-2"><strong>Description:</strong><p class="mt-1">{{ reclamation.description }}</p></div>
              <div class="col-12" *ngIf="reclamation.note">
                <strong>Note client:</strong> {{ '⭐'.repeat(reclamation.note) }} ({{ reclamation.note }}/5)
              </div>
            </div>
          </div>

          <!-- Timeline -->
          <div class="card p-4">
            <h6 class="fw-bold mb-3">📅 Historique des actions</h6>
            <div class="timeline" *ngIf="suivis.length > 0">
              <div class="timeline-item" *ngFor="let s of suivis"
                   [style.background]="s.action === 'INTERNAL_NOTE' ? '#fef9c3' : 'transparent'"
                   [style.border-left]="s.action === 'INTERNAL_NOTE' ? '3px solid #eab308' : 'none'"
                   style="padding: 6px 8px; border-radius: 4px; margin-bottom: 8px;">
                <div class="fw-semibold d-flex align-items-center gap-2">
                  <span *ngIf="s.action === 'INTERNAL_NOTE'" class="badge bg-warning text-dark">🔒 Note interne</span>
                  <span *ngIf="s.action === 'REPLY_AGENT'" class="badge bg-primary">💬 Réponse agent</span>
                  <span *ngIf="s.action === 'REPLY_CLIENT'" class="badge bg-secondary">👤 Message client</span>
                  <span *ngIf="s.action === 'STATUS_CHANGE'" class="badge bg-success">🔄 Changement statut</span>
                </div>
                <div class="text-muted small mt-1">{{ s.date | date:'dd/MM/yyyy' }} — {{ s.employeNom || 'Client' }}</div>
                <div class="mt-1">{{ s.message }}</div>
              </div>
            </div>
            <p *ngIf="suivis.length === 0" class="text-muted">Aucun suivi</p>

            <!-- Add suivi -->
            <hr>
            <h6 class="fw-bold">Ajouter une action</h6>
            <div class="row g-2">
              <div class="col-md-6">
                <select class="form-select" [(ngModel)]="newAction">
                  <option value="REPLY_AGENT">Réponse au client</option>
                  <option value="INTERNAL_NOTE">Note interne</option>
                </select>
              </div>
              <div class="col-12">
                <textarea class="form-control" [(ngModel)]="newMessage" rows="2" placeholder="Message..."></textarea>
              </div>
              <div class="col-12">
                <button class="btn btn-primary btn-sm" (click)="addSuivi()">Ajouter</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="col-md-4">
          <div class="card p-4">
            <h6 class="fw-bold mb-3">⚡ Changer le statut</h6>
            <div class="d-flex flex-column gap-2">
              <button *ngIf="reclamation.statut === 'EN_ATTENTE'"
                      class="btn btn-outline-primary"
                      (click)="changerStatut('EN_COURS')">
                ▶ Mettre En cours
              </button>
              <button *ngIf="reclamation.statut === 'EN_COURS' || reclamation.statut === 'EN_ATTENTE'"
                      class="btn btn-outline-success mt-1"
                      (click)="changerStatut('TRAITEE')">
                ✅ Clôturer (Traitée)
              </button>
              <div *ngIf="statusError" class="alert alert-danger py-2 small">{{ statusError }}</div>
              <hr>
              <button class="btn btn-danger w-100" (click)="delete()">🗑 Supprimer</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AgentReclamationDetailComponent implements OnInit {
  reclamation?: Reclamation;
  suivis: SuiviReclamation[] = [];
  newMessage = '';
  newAction = 'REPLY_AGENT';
  statusError = '';
  agentId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private reclamationService: ReclamationService,
    private suiviService: SuiviService,
    private agentService: AgentService,
    private pdfService: PdfService
  ) {}

  ngOnInit(): void {
    const id = +this.route.snapshot.params['id'];
    this.reclamationService.getById(id).subscribe(r => this.reclamation = r);
    this.suiviService.getByReclamation(id).subscribe(s => this.suivis = s);
    this.agentService.getMe().subscribe(agent => this.agentId = agent.id!);
  }

  changerStatut(statut: StatutReclamation): void {
    this.statusError = '';
    this.reclamationService.changerStatut(this.reclamation!.id!, statut).subscribe({
      next: r => {
        this.reclamation = r;
        this.suiviService.getByReclamation(r.id!).subscribe(s => this.suivis = s);
      },
      error: err => this.statusError = err.error?.message || 'Transition invalide'
    });
  }

  addSuivi(): void {
    if (!this.newMessage.trim()) return;
    this.suiviService.create({
      reclamationId: this.reclamation!.id!,
      message: this.newMessage,
      action: this.newAction as any,
      employeId: this.agentId || undefined
    }).subscribe(s => {
      this.suivis.push(s);
      this.newMessage = '';
    });
  }

  delete(): void {
    if (confirm('Supprimer définitivement cette réclamation ?')) {
      this.reclamationService.delete(this.reclamation!.id!).subscribe({
        next: () => this.router.navigate(['/agent/reclamations']),
        error: (err) => alert(err.error?.message || 'Erreur lors de la suppression')
      });
    }
  }

  exportPdf(): void {
    this.pdfService.generateReclamationPdf(this.reclamation!, this.suivis);
  }
}
