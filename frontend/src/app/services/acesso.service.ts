import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface PerfilRequest {
    nome: string;
    permissoes: string[]; // Ex: ['acessaDashboard', 'acessaChat']
}

@Injectable({
    providedIn: 'root'
})
export class AcessoService {
    private apiUrl = 'http://localhost:3000/api/acesso';

    constructor(private http: HttpClient) {}

    // Retorna todos os perfis com suas permissões (para a tabela)
    getPerfisComPermissoes(): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrl);
    }

    // Cria novo perfil com permissões
    criarPerfil(perfil: PerfilRequest): Observable<any> {
        return this.http.post(this.apiUrl, perfil);
    }

    // Atualiza um perfil existente e suas permissões
    atualizarPerfil(id: number, perfil: PerfilRequest): Observable<any> {
        return this.http.put(`${this.apiUrl}/${id}`, perfil);
    }

    // Exclui um perfil (e suas permissões associadas)
    excluirPerfil(id: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }
}
