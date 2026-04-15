import { Routes } from '@angular/router';
import { roleGuard } from './guards/role.guard';
import { LoginComponent } from './components/login/login.component';
import { ClientLayoutComponent } from './components/client/client-layout.component';
import { AgentLayoutComponent } from './components/agent/agent-layout.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'register',
    loadComponent: () => import('./components/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'client',
    component: ClientLayoutComponent,
    canActivate: [roleGuard('CLIENT')],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () => import('./components/client/client-dashboard.component').then(m => m.ClientDashboardComponent)
      },
      {
        path: 'reclamations',
        loadComponent: () => import('./components/client/client-reclamation-list.component').then(m => m.ClientReclamationListComponent)
      },
      {
        path: 'reclamations/new',
        loadComponent: () => import('./components/client/client-reclamation-form.component').then(m => m.ClientReclamationFormComponent)
      },
      {
        path: 'reclamations/:id/edit',
        loadComponent: () => import('./components/client/client-reclamation-form.component').then(m => m.ClientReclamationFormComponent)
      },
      {
        path: 'reclamations/:id',
        loadComponent: () => import('./components/client/client-reclamation-detail.component').then(m => m.ClientReclamationDetailComponent)
      }
    ]
  },
  {
    path: 'agent',
    component: AgentLayoutComponent,
    canActivate: [roleGuard('AGENT_SAV')],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () => import('./components/agent/agent-dashboard.component').then(m => m.AgentDashboardComponent)
      },
      {
        path: 'reclamations',
        loadComponent: () => import('./components/agent/agent-reclamation-list.component').then(m => m.AgentReclamationListComponent)
      },
      {
        path: 'reclamations/:id',
        loadComponent: () => import('./components/agent/agent-reclamation-detail.component').then(m => m.AgentReclamationDetailComponent)
      },
      {
        path: 'clients',
        loadComponent: () => import('./components/agent/agent-clients.component').then(m => m.AgentClientsComponent)
      }
    ]
  },
  { path: '**', redirectTo: 'login' }
];
