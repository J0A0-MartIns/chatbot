import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UsuarioPayload, TrocarSenhaPayload, Usuario, CriarUsuarioResponse } from '../models/usuario.model';
import { environment } from '../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private apiUrl = `${environment.apiUrl}/usuarios`;

    constructor(private http: HttpClient) {}

    // --- MÉTODOS PÚBLICOS (TELA DE CADASTRO) ---
    /** Envia uma solicitação de registo (cria um utilizador pendente). */
    registrar(dadosUsuario: UsuarioPayload): Observable<any> {
        return this.http.post(this.apiUrl, dadosUsuario);
    }

    // --- MÉTODO PARA O UTILIZADOR LOGADO ---
    /** Altera a senha do utilizador logado. */
    trocarSenha(id: number, payload: TrocarSenhaPayload): Observable<any> {
        return this.http.post(`${this.apiUrl}/${id}/trocar-senha`, payload);
    }

    // --- MÉTODOS PARA ADMINS (TELA DE GESTÃO) ---

    /** Busca todos os utilizadores ATIVOS. */
    getUsuarios(): Observable<Usuario[]> {
        return this.http.get<Usuario[]>(this.apiUrl);
    }

    /** Cria um novo utilizador diretamente como ATIVO. */
    // CORREÇÃO: O tipo de retorno agora é o correto para corresponder à resposta da API.
    criarUsuarioAtivo(dadosUsuario: UsuarioPayload): Observable<CriarUsuarioResponse> {
        return this.http.post<CriarUsuarioResponse>(`${this.apiUrl}/criar-ativo`, dadosUsuario);
    }

    /** Atualiza os dados de um utilizador ativo. */
    atualizarUsuario(id: number, dadosUsuario: Partial<UsuarioPayload>): Observable<Usuario> {
        return this.http.put<Usuario>(`${this.apiUrl}/${id}`, dadosUsuario);
    }

    /** Desativa (soft delete) um utilizador ativo. */
    desativarUsuario(id: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }

    // --- MÉTODOS PARA GERIR PENDÊNCIAS ---

    /** Busca todos os utilizadores PENDENTES. */
    getUsuariosPendentes(): Observable<Usuario[]> {
        return this.http.get<Usuario[]>(`${this.apiUrl}/pendentes`);
    }

    /** Aprova uma solicitação pendente. */
    aprovarPendente(id: number): Observable<any> {
        return this.http.post(`${this.apiUrl}/pendentes/${id}/aprovar`, {});
    }

    /** Rejeita (exclui) uma solicitação pendente. */
    rejeitarPendente(id: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/pendentes/${id}`);
    }
}
