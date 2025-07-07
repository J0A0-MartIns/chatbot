import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

//Dados dos relatórios
export interface RelatorioInteracao {
    data_atendimento: string;
    pergunta_usuario: string;
    resposta_gerada: string;
    usuario: string;
    avaliacao: boolean | null;
    tema: string;
    sub_tema: string;
}

export interface RelatorioUsoSubtema {
    id_subtema: number;
    nome: string;
    count: string;
}

@Injectable({
    providedIn: 'root'
})
export class RelatorioService {
    private apiUrl = `${environment.apiUrl}/relatorios`;

    constructor(private http: HttpClient) {}

    /**
     * Busca o relatório de interações com filtros opcionais.
     */
    getRelatorioInteracoes(filtros: { id_tema?: number; id_subtema?: number }): Observable<RelatorioInteracao[]> {
        let params = new HttpParams();
        if (filtros.id_tema) params = params.set('id_tema', filtros.id_tema);
        if (filtros.id_subtema) params = params.set('id_subtema', filtros.id_subtema);
        return this.http.get<RelatorioInteracao[]>(`${this.apiUrl}/interacoes`, { params });
    }

    /**
     * Busca o relatório de uso de subtemas por período.
     */
    getRelatorioUsoSubtema(filtros: { dataInicio?: string; dataFim?: string }): Observable<RelatorioUsoSubtema[]> {
        let params = new HttpParams();
        if (filtros.dataInicio) params = params.set('de', filtros.dataInicio);
        if (filtros.dataFim) params = params.set('ate', filtros.dataFim);
        return this.http.get<RelatorioUsoSubtema[]>(`${this.apiUrl}/uso-subtema`, { params });
    }
}