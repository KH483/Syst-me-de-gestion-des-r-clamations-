import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ReclamationService } from '../../services/reclamation.service';
import { SuiviService } from '../../services/suivi.service';
import { PdfService } from '../../services/pdf.service';
import { Reclamation } from '../../models/reclamation.model';
import { SuiviReclamation } from '../../models/suivi.model';

@Component({
  selector: 'app-client-reclamation-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div *ngIf="reclamation">
      <div class="d-flex align-items-center gap-2 mb-4">
        <a routerLink="/client/reclamations" class="btn btn-outline-secondary btn-sm">← Retour</a>
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
              <div class="col-6"><strong>Produit:</strong> {{ reclamation.produit }}</div>
              <div class="col-6"><strong>Date:</strong> {{ reclamation.date | date:'dd/MM/yyyy' }}</div>
              <div class="col-6"><strong>Agent:</strong> {{ reclamation.agentNom || 'Non assigné' }}</div>
              <div class="col-12 mt-2"><strong>Description:</strong><p class="mt-1">{{ reclamation.description }}</p></div>
            </div>
          </div>

          <!-- Timeline -->
          <div class="card p-4 mb-4">
            <h6 class="fw-bold mb-3">📅 Historique</h6>
            <div class="timeline" *ngIf="suivis.length > 0">
              <div class="timeline-item" *ngFor="let s of suivis">
                <div class="fw-semibold">{{ s.action }}</div>
                <div class="text-muted small">{{ s.date | date:'dd/MM/yyyy' }} — {{ s.employeNom || 'Vous' }}</div>
                <div class="mt-1">{{ s.message }}</div>
              </div>
            </div>
            <p *ngIf="suivis.length === 0" class="text-muted">Aucun suivi</p>

            <!-- Add message -->
            <hr>
            <h6 class="fw-bold">Ajouter un message</h6>
            <textarea class="form-control mb-2" [(ngModel)]="newMessage" rows="2" placeholder="Votre message..."></textarea>
            <button class="btn btn-primary btn-sm" (click)="addMessage()">Envoyer</button>
          </div>
        </div>

        <!-- Rating -->
        <div class="col-md-4">
          <div class="card p-4" *ngIf="reclamation.statut === 'TRAITEE' && !reclamation.note">
            <h6 class="fw-bold mb-3">⭐ Évaluer le service</h6>
            <p class="text-muted small">Votre réclamation a été traitée. Comment évaluez-vous notre service ?</p>
            <div class="d-flex gap-2 mb-3">
              <button *ngFor="let n of [1,2,3,4,5]" class="btn btn-sm"
                      [class]="selectedNote === n ? 'btn-warning' : 'btn-outline-warning'"
                      (click)="selectedNote = n">{{ n }}⭐</button>
            </div>
            <button class="btn btn-success w-100" [disabled]="!selectedNote" (click)="noter()">Valider</button>
          </div>
          <div class="card p-4" *ngIf="reclamation.note">
            <h6 class="fw-bold">Votre évaluation</h6>
            <div class="fs-3">{{ '⭐'.repeat(reclamation.note) }}</div>
            <small class="text-muted">{{ reclamation.note }}/5</small>
          </div>
          <div class="card p-4 mt-3" *ngIf="reclamation.statut === 'EN_ATTENTE'">
            <a [routerLink]="['/client/reclamations', reclamation.id, 'edit']" class="btn btn-outline-secondary w-100">✏️ Modifier</a>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ClientReclamationDetailComponent implements OnInit {
  reclamation?: Reclamation;
  suivis: SuiviReclamation[] = [];
  newMessage = '';
  selectedNote = 0;

  constructor(
    private route: ActivatedRoute,
    private reclamationService: ReclamationService,
    private suiviService: SuiviService,
    private pdfService: PdfService
  ) {}

  ngOnInit(): void {
    const id = +this.route.snapshot.params['id'];
    this.reclamationService.getById(id).subscribe(r => this.reclamation = r);
    this.suiviService.getByReclamation(id).subscribe(s => this.suivis = s);
  }

  addMessage(): void {
    if (!this.newMessage.trim()) return;
    this.suiviService.create({
      reclamationId: this.reclamation!.id!,
      message: this.newMessage,
      action: 'REPLY_CLIENT' as any
    }).subscribe(s => {
      this.suivis.push(s);
      this.newMessage = '';
    });
  }

  noter(): void {
    if (!this.selectedNote) return;
    this.reclamationService.noter(this.reclamation!.id!, this.selectedNote).subscribe((r: Reclamation) => {
      this.reclamation = r;
    });
  }

  exportPdf(): void {
    this.pdfService.generateReclamationPdf(this.reclamation!, this.suivis);
  }
}
