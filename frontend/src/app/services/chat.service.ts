import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

export interface PerguntaPayload {
    pergunta: string;
    id_subtema: number;
}

export interface RespostaChat {
    id_atendimento: number;
    resposta: string;
}

export interface FeedbackPayload {
    id_atendimento: number;
    avaliacao: boolean; // true = útil, false = não útil
}

@Injectable({
    providedIn: 'root'
})
export class ChatService {
    private apiUrl = `${environment.apiUrl}/chat`;

    constructor(private http: HttpClient) {}

    perguntar(payload: PerguntaPayload): Observable<RespostaChat> {
        return this.http.post<RespostaChat>(`${this.apiUrl}/perguntar`, payload);
    }

    enviarFeedback(payload: FeedbackPayload): Observable<any> {
        return this.http.post(`${this.apiUrl}/feedback`, payload);
    }
}
