import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
    UsuarioPayload,
    TrocarSenhaPayload,
    Usuario,
    CriarUsuarioResponse
} from '../models/usuario.model'; // Garante que todas as interfaces são importadas
import { environment } from '../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class UsuarioService {
    private apiUrl = `${environment.apiUrl}/usuarios`;

    constructor(private http: HttpClient) {}

    /** Envia uma solicitação de registo (cria um usuário pendente). */
    registrar(dadosUsuario: UsuarioPayload): Observable<any> {
        return this.http.post(this.apiUrl, dadosUsuario);
    }

    /** Altera a senha do usuário já logado. */
    trocarSenha(id: number, payload: TrocarSenhaPayload): Observable<any> {
        return this.http.post(`${this.apiUrl}/${id}/trocar-senha`, payload);
    }

    // --- MÉTODOS PARA ADMINS (TELA DE GESTÃO) ---

    /** Busca todos os utilizadores ATIVOS. */
    getUsuarios(): Observable<Usuario[]> {
        return this.http.get<Usuario[]>(this.apiUrl);
    }

    /** Cria um novo utilizador diretamente como ATIVO. */
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

    /** Busca todos os utilizadores PENDENTES (com status: 'pendente'). */
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