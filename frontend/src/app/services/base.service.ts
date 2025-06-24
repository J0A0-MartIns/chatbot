import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Documento {
    id_documento?: number;
    nome: string; // nome do documento
    tema: string;
    microtema: string;
    conteudo: string;
    palavrasChave: string[]; // array de palavras-chave
    arquivos: { nome: string; tipo: string }[]; // arquivos enviados
    ativo: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class BaseService {
    private apiUrl = 'http://localhost:3000/api/base';

    constructor(private http: HttpClient) {}

    // Listar documentos
    getDocumentos(): Observable<Documento[]> {
        return this.http.get<Documento[]>(this.apiUrl);
    }

    // Criar novo documento
    createDocumento(doc: Documento): Observable<any> {
        return this.http.post(this.apiUrl, doc);
    }

    // Atualizar documento
    updateDocumento(id: number, doc: Partial<Documento>): Observable<any> {
        return this.http.put(`${this.apiUrl}/${id}`, doc);
    }

    // Excluir documento
    deleteDocumento(id: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }

    // Ativar / Inativar
    ativarOuDesativar(id: number, ativo: boolean): Observable<any> {
        return this.http.patch(`${this.apiUrl}/${id}/ativo`, { ativo });
    }

    // Upload de arquivo
    uploadArquivo(file: File): Observable<{ nome: string; tipo: string }> {
        const formData = new FormData();
        formData.append('arquivo', file);
        return this.http.post<{ nome: string; tipo: string }>(`${this.apiUrl}/upload`, formData);
    }
}
