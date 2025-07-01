import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
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

    //BehaviorSubject guarda o estado atual do usuário e notifica os subscritores.
    private userSubject = new BehaviorSubject<Usuario | null>(null);
    //Os componentes irão escutar este Observable público
    public user$ = this.userSubject.asObservable();

    constructor(
        private http: HttpClient,
        private router: Router
    ) {
        // Ao iniciar o serviço, tenta carregar o usuário
        this.loadInitialUser();
    }

    private loadInitialUser(): void {
        const userJson = localStorage.getItem('currentUser');
        if (userJson) {
            this.userSubject.next(JSON.parse(userJson));
        }
    }

    /**
     * Autentica um usuário, salva a sessão e notifica a aplicação.
     */
    login(email: string, senha: string): Observable<AuthResponse> {
        const payload = { email, senha };
        return this.http.post<AuthResponse>(`${this.authApiUrl}/login`, payload).pipe(
            tap(response => {
                localStorage.setItem('authToken', response.token);
                localStorage.setItem('currentUser', JSON.stringify(response.usuario));
                this.userSubject.next(response.usuario);
            })
        );
    }

    /**
     * Faz o logout - notifica o back-end primeiro e depois limpa a sessão local.
     */
    logout(): void {
        this.http.post(`${this.authApiUrl}/logout`, {}).subscribe({
            // Limpa a sessão localmente..
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


    /**
     * Retorna o valor atual do utilizador de forma síncrona.
     */
    getUser(): Usuario | null {
        return this.userSubject.value;
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

    private clearSessionAndRedirect(): void {
        localStorage.removeItem('authToken');
        localStorage.removeItem('currentUser');
        this.userSubject.next(null);
        this.router.navigate(['/login']);
    }

    private setSession(authResponse: AuthResponse): void {
        localStorage.setItem('authToken', authResponse.token);
        const userData = JSON.stringify(authResponse.usuario);
        localStorage.setItem('currentUser', userData);
        this.userSubject.next(authResponse.usuario);
    }
}