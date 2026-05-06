import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Client } from '../models/client.model';
import { Page } from '../models/reclamation.model';

@Injectable({ providedIn: 'root' })
export class ClientService {
  private apiUrl = '/api/clients';

  constructor(private http: HttpClient) {}

  getAll(page = 0, size = 10): Observable<Page<Client>> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<Page<Client>>(this.apiUrl, { params });
  }

  getById(id: number): Observable<Client> {
    return this.http.get<Client>(`${this.apiUrl}/${id}`);
  }

  create(client: Client): Observable<Client> {
    return this.http.post<Client>(this.apiUrl, client);
  }

  update(id: number, client: Client): Observable<Client> {
    return this.http.put<Client>(`${this.apiUrl}/${id}`, client);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
