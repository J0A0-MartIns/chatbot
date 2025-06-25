// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable, tap } from 'rxjs';
// import { Router } from '@angular/router'; // <-- 1. Importa o Router
// import { environment } from '../environments/environment';
// import { Usuario } from '../models/user.model';
//
// // Interface para a resposta do login
// export interface AuthResponse {
//     token: string;
//     usuario: Usuario;
// }
//
// @Injectable({
//     providedIn: 'root'
// })
// export class AuthService {
//     private apiUrl = `${environment.apiUrl}/auth`;
//     private currentUser: Usuario | null = null;
//
//     constructor(
//         private http: HttpClient,
//         private router: Router // <-- 2. Injeta o Router
//     ) {}
//
//     /**
//      * Autentica um utilizador e armazena o token e os dados do utilizador.
//      */
//     login(email: string, password: string): Observable<AuthResponse> {
//         return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { email, password }).pipe(
//             tap(response => this.setSession(response))
//         );
//     }
//
//     /**
//      * --- CORREÇÃO ---
//      * Agora, o logout primeiro notifica o back-end ANTES de limpar os dados locais.
//      */
//     logout(): void {
//         // Envia a requisição para a API para registar a data de logout.
//         // O AuthInterceptor irá adicionar o token automaticamente.
//         this.http.post(`${this.apiUrl}/logout`, {}).subscribe({
//             // O 'finally' block seria ideal aqui, mas para manter a simplicidade,
//             // vamos limpar a sessão localmente independentemente do resultado da API
//             // para garantir que o utilizador seja sempre deslogado da interface.
//             next: () => this.clearSessionAndRedirect(),
//             error: () => this.clearSessionAndRedirect()
//         });
//     }
//
//     /**
//      * Função helper para limpar a sessão local e redirecionar o utilizador.
//      */
//     private clearSessionAndRedirect(): void {
//         localStorage.removeItem('authToken');
//         localStorage.removeItem('currentUser');
//         this.currentUser = null;
//         this.router.navigate(['/login']);
//     }
//
//     private setSession(authResponse: AuthResponse): void {
//         localStorage.setItem('authToken', authResponse.token);
//         const userData = JSON.stringify(authResponse.usuario);
//         localStorage.setItem('currentUser', userData);
//         this.currentUser = authResponse.usuario;
//     }
//
//     // getUser(): Usuario | null {
//     //     if (this.currentUser) {
//     //         return this.currentUser;
//     //     }
//     //     const userJson = localStorage.getItem('currentUser');
//     //     if (userJson) {
//     //         this.currentUser = JSON.parse(userJson);
//     //         return this.currentUser;
//     //     }
//     //     return null;
//     // }
//
//     // getToken(): string | null {
//     //     return localStorage.getItem('authToken');
//     // }
//     //
//     // isLoggedIn(): boolean {
//     //     return !!this.getToken();
//     // }
// }
