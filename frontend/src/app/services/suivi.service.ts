import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SuiviReclamation } from '../models/suivi.model';

@Injectable({ providedIn: 'root' })
export class SuiviService {
  private apiUrl = 'http://localhost:9090/api/suivis';

  constructor(private http: HttpClient) {}

  getByReclamation(reclamationId: number): Observable<SuiviReclamation[]> {
    return this.http.get<SuiviReclamation[]>(`${this.apiUrl}/reclamation/${reclamationId}`);
  }

  create(suivi: SuiviReclamation): Observable<SuiviReclamation> {
    return this.http.post<SuiviReclamation>(this.apiUrl, suivi);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
