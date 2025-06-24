import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Pendencia {
    id_pendencia: number;
    data: string;
    tema: string;
    microtema: string;
    pergunta: string;
    avaliacao?: string | number;
}

@Injectable({
    providedIn: 'root'
})
export class PendenciaService {
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

    // Adicionar a pendência à base de conhecimento (opcional - se tiver essa rota)
    criar(id: number): Observable<any> {
        return this.http.post(`${this.apiUrl}/${id}/adicionar`, {});
    }
}
