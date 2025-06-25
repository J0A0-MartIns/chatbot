import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { Subtema } from '../models/subtema.model';

@Injectable({
    providedIn: 'root'
})
export class SubtemaService {
    private apiUrl = `${environment.apiUrl}/subtemas`;

    constructor(private http: HttpClient) {}

    /**
     * Busca todos os subtemas pertencentes a um tema específico.
     * Corresponde a: GET /api/subtemas/tema/:id_tema
     */
    getSubtemasPorTema(id_tema: number): Observable<Subtema[]> {
        return this.http.get<Subtema[]>(`${this.apiUrl}/tema/${id_tema}`);
    }
}
