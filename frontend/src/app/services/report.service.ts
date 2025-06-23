import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface RelatorioItem {
    id_atendimento: number;
    texto_entrada_usuario: string;
    resposta_gerada: string;
    data_atendimento: string;
    avaliacao: number | null;
    tema?: string;
    sub_tema?: string;
}

@Injectable({
    providedIn: 'root'
})
export class ReportService {
    private apiUrl = 'http://localhost:3000/api/relatorios';

    constructor(private http: HttpClient) {}

    // Buscar relatório com filtros (todos são opcionais)
    buscarRelatorio(filtros: {
        tema?: number;
        subtema?: number;
        dataInicio?: string;
        dataFim?: string;
    }): Observable<RelatorioItem[]> {
        let params = new HttpParams();

        if (filtros.tema) params = params.set('tema', filtros.tema.toString());
        if (filtros.subtema) params = params.set('subtema', filtros.subtema.toString());
        if (filtros.dataInicio) params = params.set('de', filtros.dataInicio);
        if (filtros.dataFim) params = params.set('ate', filtros.dataFim);

        return this.http.get<RelatorioItem[]>(this.apiUrl, { params });
    }
}
