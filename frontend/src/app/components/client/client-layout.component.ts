import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-client-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="d-flex">
      <nav class="sidebar">
        <div class="sidebar-brand">🎯 Mes Réclamations</div>
        <ul class="nav flex-column px-2">
          <li class="nav-item">
            <a class="nav-link" routerLink="/client/dashboard" routerLinkActive="active">📊 Tableau de bord</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" routerLink="/client/reclamations" routerLinkActive="active">📋 Mes réclamations</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" routerLink="/client/reclamations/new" routerLinkActive="active">➕ Nouvelle réclamation</a>
          </li>
        </ul>
        <div style="position: absolute; bottom: 0; width: 100%; padding: 1rem;">
          <div class="text-white-50 small mb-2">{{ username }}</div>
          <button class="btn btn-outline-light btn-sm w-100" (click)="logout()">🚪 Déconnexion</button>
        </div>
      </nav>
      <main class="main-content flex-grow-1">
        <router-outlet></router-outlet>
      </main>
    </div>
  `
})
export class ClientLayoutComponent {
  username = '';
  constructor(private authService: AuthService) {
    this.authService.currentUser$.subscribe(u => this.username = u?.username || '');
  }
  logout() { this.authService.logout(); }
}
