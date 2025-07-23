import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

export interface DashboardStats {
    respostasEncontradasHoje: number;
    usuariosAtivosCount: number;
    pendenciasCount: number;
    usuariosPendentesCount: number;
}

export interface TaxaRespostasData {
    encontradas: number;
    naoEncontradas: number;
}

export interface VolumeAtendimentosData {
    dia: string;
    count: string;
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

    getTaxaRespostas(): Observable<TaxaRespostasData> {
        return this.http.get<TaxaRespostasData>(`${this.apiUrl}/taxa-respostas`);
    }

    getVolumeAtendimentos(): Observable<VolumeAtendimentosData[]> {
        return this.http.get<VolumeAtendimentosData[]>(`${this.apiUrl}/volume-atendimentos`);
    }
}
