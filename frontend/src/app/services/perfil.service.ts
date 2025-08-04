import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Perfil } from '../models/perfil.model';
import { Permissao } from '../models/permissao.model';
import { environment } from '../environments/environment';


@Injectable({
    providedIn: 'root'
})
export class PerfilService {
    private perfilApiUrl = `${environment.apiUrl}/perfis`;
    private permissaoApiUrl = `${environment.apiUrl}/permissoes`;

    constructor(private http: HttpClient) {}

    getPerfis(): Observable<Perfil[]> {
        return this.http.get<Perfil[]>(this.perfilApiUrl);
    }
}
