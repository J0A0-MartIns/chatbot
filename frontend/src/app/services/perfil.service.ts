import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Perfil {
    id_perfil: number;
    nome: string;
}

export interface Permissao {
    id_permissao: number;
    nome: string;
}

@Injectable({
    providedIn: 'root'
})
export class AcessoService {
    private apiUrl = 'http://localhost:3000/api/perfis';

    constructor(private http: HttpClient) {}

    // Perfis
    listarPerfis(): Observable<Perfil[]> {
        return this.http.get<Perfil[]>(this.apiUrl);
    }

    criarPerfil(nome: string): Observable<any> {
        return this.http.post(this.apiUrl, { nome });
    }

    atualizarPerfil(id: number, nome: string): Observable<any> {
        return this.http.put(`${this.apiUrl}/${id}`, { nome });
    }

    excluirPerfil(id: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }

    // Permissões de um perfil
    listarPermissoes(idPerfil: number): Observable<Permissao[]> {
        return this.http.get<Permissao[]>(`${this.apiUrl}/${idPerfil}/permissoes`);
    }

    atribuirPermissao(idPerfil: number, idPermissao: number): Observable<any> {
        return this.http.post(`${this.apiUrl}/${idPerfil}/permissoes`, { idPermissao });
    }

    removerPermissao(idPerfil: number, idPermissao: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${idPerfil}/permissoes/${idPermissao}`);
    }
}
