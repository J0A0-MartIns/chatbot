import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../environments/environment';
import { Usuario } from '../models/usuario.model';

// Interface para a resposta do login
export interface AuthResponse {
    token: string;
    usuario: Usuario;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    // URLs base da API, centralizadas e puxadas do arquivo de environment
    private authApiUrl = `${environment.apiUrl}/auth`;
    private passwordApiUrl = `${environment.apiUrl}/password`;

    // Armazena os dados do usuário em memória para acesso rápido
    private currentUser: Usuario | null = null;

    constructor(
        private http: HttpClient,
        private router: Router
    ) {}

    /**
     * Autentica um utilizador, salva a sessão e retorna os dados.
     */
    login(email: string, senha: string): Observable<AuthResponse> {
        // --- CORREÇÃO ---
        // Garante que o objeto enviado para a API tenha a propriedade 'senha',
        // que é o que o back-end espera.
        const payload = { email, senha };
        return this.http.post<AuthResponse>(`${this.authApiUrl}/login`, payload).pipe(
            tap(response => this.setSession(response))
        );
    }

    /**
     * Faz o logout: notifica o back-end primeiro e depois limpa a sessão local.
     */
    logout(): void {
        this.http.post(`${this.authApiUrl}/logout`, {}).subscribe({
            // Limpa a sessão localmente, independentemente do resultado da API,
            // para garantir que o utilizador seja sempre deslogado da interface.
            next: () => this.clearSessionAndRedirect(),
            error: () => this.clearSessionAndRedirect()
        });
    }

    /**
     * Solicita um link de recuperação de senha.
     */
    forgotPassword(email: string): Observable<any> {
        return this.http.post(`${this.passwordApiUrl}/forgot`, { email });
    }

    /**
     * Redefine a senha utilizando um token de segurança.
     */
    resetPassword(token: string, senha: string): Observable<any> {
        return this.http.post(`${this.passwordApiUrl}/reset/${token}`, { senha });
    }

    // --- Funções Helper de Gestão de Sessão ---

    /**
     * Retorna os dados do utilizador logado.
     */
    getUser(): Usuario | null {
        if (this.currentUser) {
            return this.currentUser;
        }
        const userJson = localStorage.getItem('currentUser');
        if (userJson) {
            this.currentUser = JSON.parse(userJson);
            return this.currentUser;
        }
        return null;
    }

    /**
     * Retorna o token de autenticação JWT.
     */
    getToken(): string | null {
        return localStorage.getItem('authToken');
    }

    /**
     * Verifica se o utilizador está logado.
     */
    isLoggedIn(): boolean {
        return !!this.getToken();
    }

    /**
     * Função privada para limpar a sessão local e redirecionar para o login.
     */
    private clearSessionAndRedirect(): void {
        localStorage.removeItem('authToken');
        localStorage.removeItem('currentUser');
        this.currentUser = null;
        this.router.navigate(['/login']);
    }

    /**
     * Função privada para salvar os dados da sessão após o login.
     */
    private setSession(authResponse: AuthResponse): void {
        localStorage.setItem('authToken', authResponse.token);
        const userData = JSON.stringify(authResponse.usuario);
        localStorage.setItem('currentUser', userData);
        this.currentUser = authResponse.usuario;
    }
}
