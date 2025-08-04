import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import {Paginacao, RelatorioInteracao, RelatorioUsoSubtema} from "../models/relatorio.model";


@Injectable({
    providedIn: 'root'
})
export class RelatorioService {
    private apiUrl = `${environment.apiUrl}/relatorios`;

    constructor(private http: HttpClient) {}

    /**
     * Busca o relatório de interações com filtros opcionais.
     */
    getRelatorioInteracoes(filtros: { id_tema?: number; id_subtema?: number; dataInicio?: string;
        dataFim?: string; page?: number; pageSize?: number; exportar?: boolean }): Observable<Paginacao<RelatorioInteracao>> {
        let params = new HttpParams();
        if (filtros.id_tema) params = params.set('id_tema', String(filtros.id_tema));
        if (filtros.id_subtema) params = params.set('id_subtema', String(filtros.id_subtema));
        if (filtros.dataInicio) params = params.set('dataInicio', filtros.dataInicio);
        if (filtros.dataFim) params = params.set('dataFim', filtros.dataFim);
        if (filtros.page) params = params.set('page', String(filtros.page));
        if (filtros.pageSize) params = params.set('pageSize', String(filtros.pageSize));
        if (filtros.exportar) params = params.set('exportar', 'true');

        return this.http.get<Paginacao<RelatorioInteracao>>(`${this.apiUrl}/interacoes`, { params });
    }

    /**
     * Busca o relatório de uso de subtemas por período.
     */
    getRelatorioUsoSubtema(filtros: { dataInicio?: string; dataFim?: string; page?: number; pageSize?: number }): Observable<Paginacao<RelatorioUsoSubtema>> {
        let params = new HttpParams();
        if (filtros.dataInicio) params = params.set('de', filtros.dataInicio);
        if (filtros.dataFim) params = params.set('ate', filtros.dataFim);
        if (filtros.page) params = params.set('page', String(filtros.page));
        if (filtros.pageSize) params = params.set('pageSize', String(filtros.pageSize));
        return this.http.get<Paginacao<RelatorioUsoSubtema>>(`${this.apiUrl}/uso-subtema`, { params });
    }
}