import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
    UsuarioPayload,
    TrocarSenhaPayload,
    Usuario,
    CriarUsuarioResponse
} from '../models/usuario.model';
import { environment } from '../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class UsuarioService {
    private apiUrl = `${environment.apiUrl}/usuarios`;

    constructor(private http: HttpClient) {}

    registrar(dadosUsuario: UsuarioPayload): Observable<any> {
        return this.http.post(this.apiUrl, dadosUsuario);
    }

    trocarSenha(id: number, payload: TrocarSenhaPayload): Observable<any> {
        return this.http.post(`${this.apiUrl}/${id}/trocar-senha`, payload);
    }

    getUsuarios(): Observable<Usuario[]> {
        return this.http.get<Usuario[]>(this.apiUrl);
    }

    criarUsuarioAtivo(dadosUsuario: UsuarioPayload): Observable<CriarUsuarioResponse> {
        return this.http.post<CriarUsuarioResponse>(`${this.apiUrl}/criar-ativo`, dadosUsuario);
    }

    atualizarUsuario(id: number, dadosUsuario: Partial<UsuarioPayload>): Observable<Usuario> {
        return this.http.put<Usuario>(`${this.apiUrl}/${id}`, dadosUsuario);
    }

    desativarUsuario(id: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }

    getUsuariosPendentes(): Observable<Usuario[]> {
        return this.http.get<Usuario[]>(`${this.apiUrl}/pendentes`);
    }

    aprovarPendente(id: number): Observable<any> {
        return this.http.post(`${this.apiUrl}/pendentes/${id}/aprovar`, {});
    }

    rejeitarPendente(id: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/pendentes/${id}`);
    }
}