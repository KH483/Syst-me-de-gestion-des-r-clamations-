import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Reclamation, Page, StatutReclamation } from '../models/reclamation.model';
import { Statistiques } from '../models/auth.model';

@Injectable({ providedIn: 'root' })
export class ReclamationService {
  private apiUrl = '/api/reclamations';

  constructor(private http: HttpClient) {}

  getAll(page = 0, size = 10, statut?: StatutReclamation, clientId?: number, agentId?: number): Observable<Page<Reclamation>> {
    let params = new HttpParams().set('page', page).set('size', size);
    if (statut) params = params.set('statut', statut);
    if (clientId) params = params.set('clientId', clientId);
    if (agentId) params = params.set('agentId', agentId);
    return this.http.get<Page<Reclamation>>(this.apiUrl, { params });
  }

  getById(id: number): Observable<Reclamation> {
    return this.http.get<Reclamation>(`${this.apiUrl}/${id}`);
  }

  create(reclamation: Reclamation): Observable<Reclamation> {
    return this.http.post<Reclamation>(this.apiUrl, reclamation);
  }

  update(id: number, reclamation: Reclamation): Observable<Reclamation> {
    return this.http.put<Reclamation>(`${this.apiUrl}/${id}`, reclamation);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  affecter(reclamationId: number, agentId: number): Observable<Reclamation> {
    return this.http.patch<Reclamation>(`${this.apiUrl}/${reclamationId}/affecter/${agentId}`, {});
  }

  changerStatut(id: number, statut: StatutReclamation): Observable<Reclamation> {
    return this.http.patch<Reclamation>(`${this.apiUrl}/${id}/statut`, null, {
      params: new HttpParams().set('statut', statut)
    });
  }

  getStatistiques(): Observable<Statistiques> {
    return this.http.get<Statistiques>(`${this.apiUrl}/statistiques`);
  }

  noter(id: number, note: number): Observable<Reclamation> {
    return this.http.patch<Reclamation>(`${this.apiUrl}/${id}/noter`, null, {
      params: new HttpParams().set('note', note)
    });
  }
}
