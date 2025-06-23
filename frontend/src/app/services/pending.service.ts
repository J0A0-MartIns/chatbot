import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Pendencia {
    id_pendencia: number;
    motivo?: string;
    id_feedback: number;
    tema?: string;
    sub_tema?: string;
}

@Injectable({
    providedIn: 'root'
})
export class PendingService {
    private apiUrl = 'http://localhost:3000/api/pendencias';

    constructor(private http: HttpClient) {}

    // Listar todas as pendências
    listar(): Observable<Pendencia[]> {
        return this.http.get<Pendencia[]>(this.apiUrl);
    }

    // Excluir uma pendência
    excluir(id: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }

    // (Opcional) Enviar para a base de conhecimento
    adicionarComoBase(id: number): Observable<any> {
        return this.http.post(`${this.apiUrl}/${id}/adicionar`, {});
    }
}
