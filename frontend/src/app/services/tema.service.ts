import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { Tema } from '../models/tema.model';

@Injectable({
    providedIn: 'root'
})
export class TemaService {
    private apiUrl = `${environment.apiUrl}/temas`;

    constructor(private http: HttpClient) {}

    /**
     * Busca todos os temas.
     * Corresponde a: GET /api/temas
     */
    getTemas(): Observable<Tema[]> {
        return this.http.get<Tema[]>(this.apiUrl);
    }
}
