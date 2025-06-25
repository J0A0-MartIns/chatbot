import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

// Interface para definir a estrutura da resposta da API
export interface DashboardStats {
    perguntasHojeCount: number;
    pendenciasCount: number;
}

@Injectable({
    providedIn: 'root'
})
export class DashboardService {
    private apiUrl = `${environment.apiUrl}/dashboard`;

    constructor(private http: HttpClient) {}

    /**
     * Busca todas as estatísticas do dashboard em uma única chamada.
     * Corresponde a: GET /api/dashboard/stats
     */
    getStats(): Observable<DashboardStats> {
        return this.http.get<DashboardStats>(`${this.apiUrl}/stats`);
    }
}
