import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Perfil } from '../models/perfil.model';
import { Permissao } from '../models/permissao.model';
import { environment } from '../environments/environment';


@Injectable({
    providedIn: 'root'
})
export class PerfilService {
    private perfilApiUrl = `${environment.apiUrl}/perfis`;
    private permissaoApiUrl = `${environment.apiUrl}/permissoes`;

    constructor(private http: HttpClient) {}

    getPerfis(): Observable<Perfil[]> {
        return this.http.get<Perfil[]>(this.perfilApiUrl);
    }

    getTodasPermissoes(): Observable<Permissao[]> {
        return this.http.get<Permissao[]>(this.permissaoApiUrl);
    }

    criarPerfil(nome: string, permissoesIds: number[]): Observable<Perfil> {
        const payload = { nome, permissoes: permissoesIds };
        return this.http.post<Perfil>(this.perfilApiUrl, payload);
    }
    atualizarPerfil(id: number, nome: string, permissoesIds: number[]): Observable<Perfil> {
        const payload = { nome, permissoes: permissoesIds };
        return this.http.put<Perfil>(`${this.perfilApiUrl}/${id}`, payload);
    }

    excluirPerfil(id: number): Observable<any> {
        return this.http.delete(`${this.perfilApiUrl}/${id}`);
    }
}
