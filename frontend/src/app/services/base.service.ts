import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Documento {
    id_documento?: number;
    titulo: string;
    conteudo: string;
    palavras_chave: string;
    data_criacao?: string;
    vezes_utilizado?: number;
    ativo?: boolean;
    usuario_id: number;
    id_subtema: number;
}

@Injectable({
    providedIn: 'root'
})
export class BaseService {
    private apiUrl = 'http://localhost:3000/api/base';

    constructor(private http: HttpClient) {}

    // Listar documentos (com filtros opcionais)
    listar(tema?: number, subtema?: number): Observable<Documento[]> {
        let params = new HttpParams();
        if (tema) params = params.set('tema', tema);
        if (subtema) params = params.set('subtema', subtema);

        return this.http.get<Documento[]>(this.apiUrl, { params });
    }

    // Criar novo documento
    criar(doc: Documento): Observable<any> {
        return this.http.post(this.apiUrl, doc);
    }

    // Atualizar documento
    atualizar(id: number, doc: Partial<Documento>): Observable<any> {
        return this.http.put(`${this.apiUrl}/${id}`, doc);
    }

    // Excluir documento
    excluir(id: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }

    // Ativar/inativar documento
    alterarStatus(id: number, ativo: boolean): Observable<any> {
        return this.http.patch(`${this.apiUrl}/${id}/ativo`, { ativo });
    }

    // Enviar arquivo (se tiver input file)
    uploadArquivo(formData: FormData): Observable<any> {
        return this.http.post(`${this.apiUrl}/upload`, formData);
    }
}
