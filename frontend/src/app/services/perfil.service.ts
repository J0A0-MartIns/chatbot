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

    /**
     * Busca todos os perfis, incluindo suas permissões associadas.
     * GET /api/perfis
     */
    getPerfis(): Observable<Perfil[]> {
        return this.http.get<Perfil[]>(this.perfilApiUrl);
    }

    /**
     * Busca a lista de TODAS as permissões disponíveis no sistema.
     * Essencial para popular os checkboxes no formulário de criação/edição.
     * GET /api/permissoes
     */
    getTodasPermissoes(): Observable<Permissao[]> {
        return this.http.get<Permissao[]>(this.permissaoApiUrl);
    }

    /**
     * Cria um novo perfil.
     * O back-end espera o nome do perfil e um array de IDs de permissão.
     * POST /api/perfis
     */
    criarPerfil(nome: string, permissoesIds: number[]): Observable<Perfil> {
        const payload = { nome, permissoes: permissoesIds };
        return this.http.post<Perfil>(this.perfilApiUrl, payload);
    }

    /**
     * Atualiza um perfil existente.
     * PUT /api/perfis/:id
     */
    atualizarPerfil(id: number, nome: string, permissoesIds: number[]): Observable<Perfil> {
        const payload = { nome, permissoes: permissoesIds };
        return this.http.put<Perfil>(`${this.perfilApiUrl}/${id}`, payload);
    }

    /**
     * Exclui um perfil.
     * DELETE /api/perfis/:id
     */
    excluirPerfil(id: number): Observable<any> {
        return this.http.delete(`${this.perfilApiUrl}/${id}`);
    }

    /**
     * ADICIONADO: Busca a lista de TODAS as permissões disponíveis no sistema.
     * Essencial para popular os checkboxes no formulário.
     */

}
