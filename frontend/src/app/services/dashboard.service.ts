import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

//Defini a estrutura da resposta da API
export interface DashboardStats {
    respostasEncontradasHoje: number;
    usuariosAtivosCount: number;
    pendenciasCount: number;
    usuariosPendentesCount: number;
}

@Injectable({
    providedIn: 'root'
})
export class DashboardService {
    private apiUrl = `${environment.apiUrl}/dashboard`;

    constructor(private http: HttpClient) {}

    getStats(): Observable<DashboardStats> {
        return this.http.get<DashboardStats>(`${this.apiUrl}/stats`);
    }
}
