import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Perfil {
    id?: number;
    nome: string;
    acessaChat: boolean;
    acessaDashboard: boolean;
    acessaBase: boolean;
    acessaGerirUsuarios: boolean;
}

@Injectable({ providedIn: 'root' })
export class PerfilService {
    private api = 'http://localhost:3000/api/perfil';

    constructor(private http: HttpClient) {}

    listar(): Observable<Perfil[]> {
        return this.http.get<Perfil[]>(this.api);
    }

    criar(perfil: Perfil): Observable<Perfil> {
        return this.http.post<Perfil>(this.api, perfil);
    }

    atualizar(id: number, perfil: Perfil): Observable<any> {
        return this.http.put(`${this.api}/${id}`, perfil);
    }

    excluir(id: number): Observable<any> {
        return this.http.delete(`${this.api}/${id}`);
    }
}
