import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Documento } from '../models/documento.model'; // Importa nosso novo modelo
import { environment } from '../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class BaseService {
    // CORREÇÃO: A URL correta do back-end para este recurso
    private apiUrl = `${environment.apiUrl}/base-conhecimento`;

    constructor(private http: HttpClient) {}

    // GET /api/base-conhecimento
    getDocumentos(): Observable<Documento[]> {
        return this.http.get<Documento[]>(this.apiUrl);
    }

    // POST /api/base-conhecimento
    criarDocumento(doc: Documento): Observable<Documento> {
        return this.http.post<Documento>(this.apiUrl, doc);
    }

    // PUT /api/base-conhecimento/:id
    atualizarDocumento(id: number, doc: Partial<Documento>): Observable<Documento> {
        return this.http.put<Documento>(`${this.apiUrl}/${id}`, doc);
    }

    // DELETE /api/base-conhecimento/:id
    excluirDocumento(id: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }

    // PATCH /api/base-conhecimento/:id/ativo
    atualizarAtivo(id: number, ativo: boolean): Observable<Documento> {
        return this.http.patch<Documento>(`${this.apiUrl}/${id}/ativo`, { ativo });
    }

    // A rota de upload de arquivo não existe de forma isolada no back-end.
    // O upload deve ser tratado de outra forma (ex: enviando um link ou usando um serviço de storage).
    // Por enquanto, vamos remover este método para evitar erros.
    // uploadArquivo(...) {}
}
