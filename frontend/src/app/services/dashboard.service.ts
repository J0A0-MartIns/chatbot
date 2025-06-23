import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class DashboardService {
    private apiUrl = 'http://localhost:3000/api/dashboard';

    constructor(private http: HttpClient) {}

    getTotalPerguntas(): Observable<number> {
        return this.http.get<number>(`${this.apiUrl}/perguntas`);
    }

    getTotalPendencias(): Observable<number> {
        return this.http.get<number>(`${this.apiUrl}/pendencias`);
    }

    getPercentualFeedbacksPositivos(): Observable<number> {
        return this.http.get<number>(`${this.apiUrl}/feedbacks`);
    }
}
