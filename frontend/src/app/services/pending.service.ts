import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Pendencia {
    id_pendencia: number;
    data: string;         // Data/Hora da pendência
    tema: string;
    microtema: string;    // Use este nome para coerência com o front
    pergunta: string;
    avaliacao?: string | number;
    motivo?: string;
    id_feedback?: number;
}

@Injectable({
    providedIn: 'root'
})
export class PendenciaService {
    private apiUrl = 'http://localhost:3000/api/pendencias';

    constructor(private http: HttpClient) {}

    listar(): Observable<Pendencia[]> {
        return this.http.get<Pendencia[]>(this.apiUrl);
    }

    excluir(id: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }

    // Caso queira usar para adicionar direto pela API
    adicionarComoBase(id: number): Observable<any> {
        return this.http.post(`${this.apiUrl}/${id}/adicionar`, {});
    }
}
