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

    getSubtemasPorTema(id_tema: number): Observable<Subtema[]> {
        return this.http.get<Subtema[]>(`${this.apiUrl}/tema/${id_tema}`);
    }

    /**
     * ADICIONADO: Cria um novo subtema associado a um tema.
     * Corresponde a: POST /api/subtemas
     */
    criarSubtema(nome: string, id_tema: number): Observable<Subtema> {
        return this.http.post<Subtema>(this.apiUrl, { nome, id_tema });
    }
}
