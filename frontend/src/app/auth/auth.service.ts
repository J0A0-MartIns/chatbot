import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, Subject, tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../environments/environment';
import { Usuario } from '../models/usuario.model';

export interface AuthResponse {
    token: string;
    usuario: Usuario;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private authApiUrl = `${environment.apiUrl}/auth`;
    private passwordApiUrl = `${environment.apiUrl}/password`;
    private userSubject = new BehaviorSubject<Usuario | null>(null);
    public user$ = this.userSubject.asObservable();
    public sessionExpired$ = new Subject<void>();
    private sessionTimer: any;

    constructor(
        private http: HttpClient,
        private router: Router
    ) {
        this.loadInitialUser();
    }

    private loadInitialUser(): void {
        const token = this.getToken();
        const userJson = localStorage.getItem('currentUser');
        if (token && userJson) {
            this.userSubject.next(JSON.parse(userJson));
            this.startSessionTimer(token); // Inicia o timer na recarga da página
        }
    }

    /**
     * Autentica um utilizador, salva a sessão e notifica a aplicação.
     */
    login(email: string, senha: string): Observable<AuthResponse> {
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
            // Limpa a sessão localmente, independentemente do resultado da API
            complete: () => this.clearSessionAndRedirect(),
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

    getUser(): Usuario | null {
        return this.userSubject.value;
    }

    getToken(): string | null {
        return localStorage.getItem('authToken');
    }

    isLoggedIn(): boolean {
        return !!this.getToken();
    }

    private clearSessionAndRedirect(): void {
        localStorage.removeItem('authToken');
        localStorage.removeItem('currentUser');
        this.userSubject.next(null);
        if (this.sessionTimer) {
            clearTimeout(this.sessionTimer); // Limpa o timer sempre que sair
        }
        this.router.navigate(['/login']);
    }

    private setSession(authResponse: AuthResponse): void {
        localStorage.setItem('authToken', authResponse.token);
        const userData = JSON.stringify(authResponse.usuario);
        localStorage.setItem('currentUser', userData);
        this.userSubject.next(authResponse.usuario);
        this.startSessionTimer(authResponse.token); // Inicia o timer no login
    }

    private startSessionTimer(token: string) {
        if (this.sessionTimer) {
            clearTimeout(this.sessionTimer);
        }

        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const expiresAt = payload.exp * 1000; // Converte para milissegundos
            const timeout = expiresAt - Date.now();

            if (timeout <= 0) {
                this.handleSessionExpiration();
                return;
            }

            //Agenda o logout automático
            this.sessionTimer = setTimeout(() => {
                this.handleSessionExpiration();
            }, timeout);

        } catch (e) {
            console.error('Não foi possível decodificar o token JWT', e);
        }
    }

    private handleSessionExpiration(): void {
        this.sessionExpired$.next();
    }
}