import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="auth-container">
      <div class="card p-4" style="width: 400px;">
        <div class="text-center mb-4">
          <h3 class="fw-bold text-primary">🎯 Réclamations</h3>
          <p class="text-muted">Connectez-vous à votre compte</p>
        </div>
        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <div class="mb-3">
            <label class="form-label">Nom d'utilisateur</label>
            <input type="text" class="form-control" formControlName="username" placeholder="admin">
            <div *ngIf="form.get('username')?.invalid && form.get('username')?.touched" class="text-danger small">
              Champ obligatoire
            </div>
          </div>
          <div class="mb-3">
            <label class="form-label">Mot de passe</label>
            <input type="password" class="form-control" formControlName="password" placeholder="••••••">
            <div *ngIf="form.get('password')?.invalid && form.get('password')?.touched" class="text-danger small">
              Champ obligatoire
            </div>
          </div>
          <div *ngIf="error" class="alert alert-danger py-2">{{ error }}</div>
          <button type="submit" class="btn btn-primary w-100" [disabled]="loading">
            {{ loading ? 'Connexion...' : 'Se connecter' }}
          </button>
        </form>
        <div class="text-center mt-3">
          <small>Pas encore de compte ? <a routerLink="/register">S'inscrire</a></small>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  form: FormGroup;
  loading = false;
  error = '';

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true;
    this.error = '';
    this.authService.login(this.form.value).subscribe({
      error: () => { this.error = 'Identifiants incorrects'; this.loading = false; }
    });
  }
}
