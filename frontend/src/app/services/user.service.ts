import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class UserService {
    private api = 'http://localhost:3000/api/usuario';

    constructor(private http: HttpClient) {}

    listar() {
        return this.http.get<any[]>(this.api);
    }

    listarPendentes() {
        return this.http.get<any[]>(`${this.api}/pendentes`);
    }

    aprovar(id: number) {
        return this.http.put(`${this.api}/aprovar/${id}`, {});
    }

    rejeitar(id: number) {
        return this.http.delete(`${this.api}/rejeitar/${id}`);
    }

    atualizar(id: number, usuario: any) {
        return this.http.put(`${this.api}/${id}`, usuario);
    }

    excluir(id: number) {
        return this.http.delete(`${this.api}/${id}`);
    }
}
