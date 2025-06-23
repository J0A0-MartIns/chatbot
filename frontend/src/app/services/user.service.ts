import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Usuario {
    id_usuario?: number;
    nome: string;
    email: string;
    senha?: string;
    id_perfil: number;
    ativo?: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private apiUrl = 'http://localhost:3000/api/usuarios';
    private authUrl = 'http://localhost:3000/api/auth';

    constructor(private http: HttpClient) {}

    // Usuários ativos
    getUsuarios(): Observable<Usuario[]> {
        return this.http.get<Usuario[]>(this.apiUrl);
    }

    // Usuários pendentes
    getPendentes(): Observable<Usuario[]> {
        return this.http.get<Usuario[]>(`${this.apiUrl}/pendentes`);
    }

    // Cadastrar novo usuário pendente (registro)
    registrar(usuario: Usuario): Observable<any> {
        return this.http.post(`${this.authUrl}/register`, usuario);
    }

    // Aprovar pendente
    aprovar(id: number): Observable<any> {
        return this.http.post(`${this.apiUrl}/aprovar/${id}`, {});
    }

    // Rejeitar pendente
    rejeitar(id: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/rejeitar/${id}`);
    }

    // Atualizar usuário
    atualizar(id: number, dados: Partial<Usuario>): Observable<any> {
        return this.http.put(`${this.apiUrl}/${id}`, dados);
    }

    // Excluir usuário
    excluir(id: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }
}
