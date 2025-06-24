import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private api = 'http://localhost:3000/api/usuario';

    constructor(private http: HttpClient) {}

    login(email: string, password: string) {
        return this.http.post<any>(`${this.api}/login`, { email, password }).pipe(
            tap(res => {
                localStorage.setItem('usuario', JSON.stringify(res.usuario));
                localStorage.setItem('token', res.token);
            })
        );
    }

    registrar(usuario: any) {
        return this.http.post(`${this.api}/registrar`, usuario);
    }

    logout() {
        localStorage.removeItem('usuario');
        localStorage.removeItem('token');
    }

    getCurrentUser() {
        const usuario = localStorage.getItem('usuario');
        return usuario ? JSON.parse(usuario) : null;
    }

    getToken() {
        return localStorage.getItem('token');
    }

}
