import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pendencia, AprovacaoPayload } from '../models/pendencia.model';
import { environment } from '../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class PendenciaService {
    private apiUrl = `${environment.apiUrl}/pendencias`;

    constructor(private http: HttpClient) {}

    /**
     * Lista todas as pendências de conteúdo.
     * GET /api/pendencias
     */
    listarPendencias(): Observable<Pendencia[]> {
        return this.http.get<Pendencia[]>(this.apiUrl);
    }

    /**
     * Rejeita (exclui) uma pendência.
     * DELETE /api/pendencias/:id
     */
    rejeitarPendencia(id: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }

    /**
     * Aprova uma pendência.
     * Envia os dados do novo documento para o back-end, que irá criar o
     * documento na base de conhecimento e excluir a pendência atomicamente.
     * POST /api/pendencias/:id/aprovar
     */
    aprovarPendencia(id: number, payload: AprovacaoPayload): Observable<any> {
        return this.http.post(`${this.apiUrl}/${id}/aprovar`, payload);
    }
}
