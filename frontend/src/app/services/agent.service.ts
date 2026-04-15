import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AgentSAV, AgentStatistiques } from '../models/agent.model';
import { Page } from '../models/reclamation.model';

@Injectable({ providedIn: 'root' })
export class AgentService {
  private apiUrl = 'http://localhost:9090/api/agents';

  constructor(private http: HttpClient) {}

  getAll(page = 0, size = 10): Observable<Page<AgentSAV>> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<Page<AgentSAV>>(this.apiUrl, { params });
  }

  getAllList(): Observable<AgentSAV[]> {
    return this.http.get<AgentSAV[]>(`${this.apiUrl}/all`);
  }

  getById(id: number): Observable<AgentSAV> {
    return this.http.get<AgentSAV>(`${this.apiUrl}/${id}`);
  }

  create(agent: AgentSAV): Observable<AgentSAV> {
    return this.http.post<AgentSAV>(this.apiUrl, agent);
  }

  update(id: number, agent: AgentSAV): Observable<AgentSAV> {
    return this.http.put<AgentSAV>(`${this.apiUrl}/${id}`, agent);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getMe(): Observable<AgentSAV> {
    return this.http.get<AgentSAV>(`${this.apiUrl}/me`);
  }

  getStatistiques(id: number): Observable<AgentStatistiques> {
    return this.http.get<AgentStatistiques>(`${this.apiUrl}/${id}/statistiques`);
  }
}
