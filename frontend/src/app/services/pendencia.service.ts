import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pendencia, AprovacaoPayload } from '../models/pendencia.model';
import { environment } from '../environments/environment';
import { Documento } from '../models/documento.model';

@Injectable({
    providedIn: 'root'
})
export class PendenciaService {
    private apiUrl = `${environment.apiUrl}/pendencias`;

    constructor(private http: HttpClient) {}

    listarPendencias(): Observable<Pendencia[]> {
        return this.http.get<Pendencia[]>(this.apiUrl);
    }

    rejeitarPendencia(id: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }

    aprovarPendencia(id: number, payload: AprovacaoPayload): Observable<Documento> {
        return this.http.post<Documento>(`${this.apiUrl}/${id}/aprovar`, payload);
    }
}