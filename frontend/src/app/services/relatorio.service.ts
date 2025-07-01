import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

export interface RelatorioItem {
    id_atendimento: number;
    texto_entrada_usuario: string;
    resposta_gerada: string;
    data_atendimento: string;
    avaliacao: boolean | null; // Avaliação é um booleano
    tema?: string;
    sub_tema?: string;
}

@Injectable({
    providedIn: 'root'
})
export class RelatorioService {
    private apiUrl = `${environment.apiUrl}/relatorios`;

    constructor(private http: HttpClient) {}

    buscarRelatorio(filtros: {
        tema?: string;
        subtema?: string;
        dataInicio?: string;
        dataFim?: string;
    }): Observable<RelatorioItem[]> {
        let params = new HttpParams();

        // Nomes dos parâmetros alinhados com req.query no back-end
        if (filtros.tema) params = params.set('tema', filtros.tema);
        if (filtros.subtema) params = params.set('subtema', filtros.subtema);
        if (filtros.dataInicio) params = params.set('de', filtros.dataInicio);
        if (filtros.dataFim) params = params.set('ate', filtros.dataFim);

        return this.http.get<RelatorioItem[]>(this.apiUrl, { params });
    }
}
