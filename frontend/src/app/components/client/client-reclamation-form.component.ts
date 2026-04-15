import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ReclamationService } from '../../services/reclamation.service';

@Component({
  selector: 'app-client-reclamation-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div>
      <div class="d-flex align-items-center gap-2 mb-4">
        <a routerLink="/client/reclamations" class="btn btn-outline-secondary btn-sm">← Retour</a>
        <h4 class="fw-bold mb-0">{{ isEdit ? 'Modifier' : 'Nouvelle' }} réclamation</h4>
      </div>
      <div class="card p-4" style="max-width: 600px;">
        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <div class="mb-3">
            <label class="form-label">Produit *</label>
            <input type="text" class="form-control" formControlName="produit" placeholder="Nom du produit concerné">
            <div *ngIf="form.get('produit')?.invalid && form.get('produit')?.touched" class="text-danger small">Champ obligatoire</div>
          </div>
          <div class="mb-3">
            <label class="form-label">Description *</label>
            <textarea class="form-control" formControlName="description" rows="5" placeholder="Décrivez votre problème en détail..."></textarea>
            <div *ngIf="form.get('description')?.invalid && form.get('description')?.touched" class="text-danger small">Champ obligatoire</div>
          </div>
          <div *ngIf="error" class="alert alert-danger py-2">{{ error }}</div>
          <div class="d-flex gap-2">
            <button type="submit" class="btn btn-primary" [disabled]="loading">
              {{ loading ? 'Enregistrement...' : (isEdit ? 'Mettre à jour' : 'Soumettre') }}
            </button>
            <a routerLink="/client/reclamations" class="btn btn-outline-secondary">Annuler</a>
          </div>
        </form>
      </div>
    </div>
  `
})
export class ClientReclamationFormComponent implements OnInit {
  form: FormGroup;
  isEdit = false;
  loading = false;
  error = '';
  id?: number;

  constructor(
    private fb: FormBuilder,
    private reclamationService: ReclamationService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.form = this.fb.group({
      produit: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    if (this.id) {
      this.isEdit = true;
      this.reclamationService.getById(this.id).subscribe(r => this.form.patchValue(r));
    }
  }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true;
    this.error = '';
    const data = { ...this.form.value, clientId: 0 }; // backend derives client from JWT
    const obs = this.isEdit
      ? this.reclamationService.update(this.id!, data)
      : this.reclamationService.create(data);
    obs.subscribe({
      next: () => this.router.navigate(['/client/reclamations']),
      error: (err) => { this.error = err.error?.message || 'Erreur'; this.loading = false; }
    });
  }
}
