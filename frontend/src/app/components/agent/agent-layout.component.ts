import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-agent-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="d-flex">
      <nav class="sidebar">
        <div class="sidebar-brand">🧑‍💼 Espace Agent</div>
        <ul class="nav flex-column px-2">
          <li class="nav-item">
            <a class="nav-link" routerLink="/agent/dashboard" routerLinkActive="active">📊 Dashboard</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" routerLink="/agent/reclamations" routerLinkActive="active">📋 Réclamations</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" routerLink="/agent/clients" routerLinkActive="active">👥 Clients</a>
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
export class AgentLayoutComponent {
  username = '';
  constructor(private authService: AuthService) {
    this.authService.currentUser$.subscribe(u => this.username = u?.username || '');
  }
  logout() { this.authService.logout(); }
}
