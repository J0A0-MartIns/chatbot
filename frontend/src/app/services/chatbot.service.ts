import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface PerguntaPayload {
    texto: string;
    temaId: number;
    subtemaId: number;
    usuarioId: number;
}

export interface RespostaChat {
    id_atendimento: number;
    resposta: string;
    sugestoes?: string[];
}

@Injectable({
    providedIn: 'root'
})
export class ChatService {
    private apiUrl = 'http://localhost:3000/api/chat';

    constructor(private http: HttpClient) {}

    // Enviar pergunta para o chatbot
    perguntar(payload: PerguntaPayload): Observable<RespostaChat> {
        return this.http.post<RespostaChat>(`${this.apiUrl}/perguntar`, payload);
    }

    // Salvar feedback do atendimento
    enviarFeedback(idAtendimento: number, avaliacao: number): Observable<any> {
        return this.http.post(`${this.apiUrl}/feedback/${idAtendimento}`, { avaliacao });
    }

    // Buscar histórico do usuário (opcional)
    getHistorico(usuarioId: number): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/historico/${usuarioId}`);
    }
}
