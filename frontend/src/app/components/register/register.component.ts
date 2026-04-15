import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="auth-container">
      <div class="card p-4" style="width: 450px;">
        <div class="text-center mb-4">
          <h3 class="fw-bold text-primary">🎯 Créer un compte</h3>
          <p class="text-muted">Rejoignez notre plateforme</p>
        </div>
        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <div class="mb-3">
            <label class="form-label">Nom complet *</label>
            <input type="text" class="form-control" formControlName="nom" placeholder="Jean Dupont">
            <div *ngIf="form.get('nom')?.invalid && form.get('nom')?.touched" class="text-danger small">Champ obligatoire</div>
          </div>
          <div class="mb-3">
            <label class="form-label">Email *</label>
            <input type="email" class="form-control" formControlName="email" placeholder="jean@example.com">
            <div *ngIf="form.get('email')?.invalid && form.get('email')?.touched" class="text-danger small">Email invalide</div>
          </div>
          <div class="mb-3">
            <label class="form-label">Téléphone</label>
            <input type="text" class="form-control" formControlName="telephone" placeholder="+33 6 00 00 00 00">
          </div>
          <div class="mb-3">
            <label class="form-label">Nom d'utilisateur *</label>
            <input type="text" class="form-control" formControlName="username" placeholder="jean_dupont">
            <div *ngIf="form.get('username')?.invalid && form.get('username')?.touched" class="text-danger small">Champ obligatoire</div>
          </div>
          <div class="mb-3">
            <label class="form-label">Mot de passe *</label>
            <input type="password" class="form-control" formControlName="password" placeholder="••••••">
            <div *ngIf="form.get('password')?.invalid && form.get('password')?.touched" class="text-danger small">Champ obligatoire</div>
          </div>
          <div *ngIf="error" class="alert alert-danger py-2">{{ error }}</div>
          <div *ngIf="success" class="alert alert-success py-2">{{ success }}</div>
          <button type="submit" class="btn btn-primary w-100" [disabled]="loading">
            {{ loading ? 'Création...' : 'Créer mon compte' }}
          </button>
          <div class="text-center mt-3">
            <small>Déjà un compte ? <a routerLink="/login">Se connecter</a></small>
          </div>
        </form>
      </div>
    </div>
  `
})
export class RegisterComponent {
  form: FormGroup;
  loading = false;
  error = '';
  success = '';

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.form = this.fb.group({
      nom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telephone: [''],
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true;
    this.error = '';
    this.authService.register(this.form.value).subscribe({
      next: () => {
        this.success = 'Compte créé avec succès ! Redirection...';
        setTimeout(() => this.router.navigate(['/login']), 1500);
      },
      error: (err) => {
        this.error = err.error || 'Erreur lors de la création du compte';
        this.loading = false;
      }
    });
  }
}
