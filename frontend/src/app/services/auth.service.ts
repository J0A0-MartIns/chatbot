import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../environments/environment';
import { Usuario } from '../models/user.model';

// Interface para a resposta do login
export interface AuthResponse {
    token: string;
    usuario: Usuario;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    // CORREÇÃO: A URL correta para o recurso de autenticação
    private apiUrl = `${environment.apiUrl}/auth`;

    // Armazena os dados do usuário em memória para acesso rápido
    private currentUser: Usuario | null = null;

    constructor(private http: HttpClient) {}

    /**
     * Autentica um usuário e armazena o token e os dados do usuário.
     * Corresponde a: POST /api/auth/login
     */
    login(email: string, password: string): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { email, password }).pipe(
            tap(response => this.setSession(response))
        );
    }

    logout(): void {
        // Limpa a sessão do localStorage e da memória
        localStorage.removeItem('authToken');
        localStorage.removeItem('currentUser');
        this.currentUser = null;
    }

    private setSession(authResponse: AuthResponse): void {
        localStorage.setItem('authToken', authResponse.token);

        const userData = JSON.stringify(authResponse.usuario);
        localStorage.setItem('currentUser', userData);

        this.currentUser = authResponse.usuario;
    }

    /**
     * Pega o usuário logado a partir do estado do serviço ou do localStorage.
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

    getToken(): string | null {
        return localStorage.getItem('authToken');
    }

    isLoggedIn(): boolean {
        return !!this.getToken();
    }
}
