import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UsuarioPayload, Usuario, UsuarioPendente } from '../models/user.model';
import { environment } from '../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private apiUrl = `${environment.apiUrl}/usuarios`;

    constructor(private http: HttpClient) {}

    // --- MÉTODOS PÚBLICOS ---

    /** Envia uma solicitação de registro (cria um usuário pendente). */
    registrar(dadosUsuario: UsuarioPayload): Observable<any> {
        return this.http.post(this.apiUrl, dadosUsuario);
    }

    // --- MÉTODOS PARA ADMINS ---

    /** Busca todos os usuários ATIVOS. */
    getUsuarios(): Observable<Usuario[]> {
        return this.http.get<Usuario[]>(this.apiUrl);
    }

    /** Cria um novo usuário diretamente como ATIVO. */
    criarUsuarioAtivo(dadosUsuario: UsuarioPayload): Observable<Usuario> {
        return this.http.post<Usuario>(`${this.apiUrl}/criar-ativo`, dadosUsuario);
    }

    /** Atualiza os dados de um usuário ativo. */
    atualizarUsuario(id: number, dadosUsuario: Partial<UsuarioPayload>): Observable<Usuario> {
        return this.http.put<Usuario>(`${this.apiUrl}/${id}`, dadosUsuario);
    }

    /** Desativa (soft delete) um usuário ativo. */
    desativarUsuario(id: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }

    // --- MÉTODOS PARA GERENCIAR PENDÊNCIAS ---

    /** Busca todos os usuários PENDENTES. */
    getUsuariosPendentes(): Observable<UsuarioPendente[]> {
        return this.http.get<UsuarioPendente[]>(`${this.apiUrl}/pendentes`);
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
