import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientService } from '../../services/client.service';
import { Client } from '../../models/client.model';

@Component({
  selector: 'app-agent-clients',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div>
      <h4 class="fw-bold mb-4">👥 Clients</h4>
      <div class="card">
        <div class="table-responsive">
          <table class="table table-hover mb-0">
            <thead class="table-light">
              <tr><th>#</th><th>Nom</th><th>Email</th><th>Téléphone</th></tr>
            </thead>
            <tbody>
              <tr *ngFor="let c of clients">
                <td>{{ c.id }}</td>
                <td>{{ c.nom }}</td>
                <td>{{ c.email }}</td>
                <td>{{ c.telephone || '—' }}</td>
              </tr>
              <tr *ngIf="clients.length === 0">
                <td colspan="4" class="text-center text-muted py-4">Aucun client</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class AgentClientsComponent implements OnInit {
  clients: Client[] = [];

  constructor(private clientService: ClientService) {}

  ngOnInit(): void {
    this.clientService.getAll(0, 100).subscribe(data => this.clients = data.content);
  }
}
