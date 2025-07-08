import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {catchError, Observable, throwError} from 'rxjs';
import { Documento } from '../models/documento.model';
import { environment } from '../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class BaseService {
    private apiUrl = `${environment.apiUrl}/base-conhecimento`;

    constructor(private http: HttpClient) {}

    getDocumentos(): Observable<Documento[]> {
        return this.http.get<Documento[]>(`${this.apiUrl}`).pipe(
            catchError(err => {
                console.error('Erro ao carregar documentos:', err);
                return throwError(() => err);
            })
        );
    }

    criarDocumento(doc: Documento): Observable<Documento> {
        return this.http.post<Documento>(this.apiUrl, doc);
    }

    atualizarDocumento(id: number, doc: Partial<Documento>): Observable<Documento> {
        return this.http.put<Documento>(`${this.apiUrl}/${id}`, doc);
    }

    excluirDocumento(id: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }

    uploadArquivo(id_documento: number, file: File): Observable<any> {
        const formData = new FormData();
        //nome deve corresponder ao usado no middleware multer no back-end.
        formData.append('arquivo', file, file.name);
        return this.http.post(`${this.apiUrl}/${id_documento}/upload`, formData);
    }

    //Implementar quando usar ia
    atualizarAtivo(id: number, ativo: boolean): Observable<Documento> {
        return this.http.patch<Documento>(`${this.apiUrl}/${id}/ativo`, { ativo });
    }

}
