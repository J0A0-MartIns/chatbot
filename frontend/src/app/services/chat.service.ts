import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

// Interface para o que enviamos ao fazer uma pergunta
export interface PerguntaPayload {
    pergunta: string;
    id_subtema: number;
}

// Interface para o que recebemos como resposta
export interface RespostaChat {
    id_atendimento: number;
    resposta: string;
    encontrado: boolean; // Flag que nos diz se uma resposta foi encontrada
}

// Interface para o que enviamos ao dar um feedback
export interface FeedbackPayload {
    id_atendimento: number;
    avaliacao: boolean; // true = útil, false = não útil
    comentario?: string; // O comentário é opcional
}

@Injectable({
    providedIn: 'root'
})
export class ChatService {
    private apiUrl = `${environment.apiUrl}/chat`;

    constructor(private http: HttpClient) {}

    /**
     * Envia a pergunta do utilizador para a API.
     */
    perguntar(payload: PerguntaPayload): Observable<RespostaChat> {
        return this.http.post<RespostaChat>(`${this.apiUrl}/perguntar`, payload);
    }

    /**
     * Envia o feedback do utilizador. O back-end criará a pendência se a avaliação for negativa.
     */
    enviarFeedback(payload: FeedbackPayload): Observable<any> {
        return this.http.post(`${this.apiUrl}/feedback`, payload);
    }

    /**
     * Cria uma pendência diretamente quando o bot não encontra uma resposta.
     */
    criarPendenciaDireta(id_atendimento: number): Observable<any> {
        return this.http.post(`${this.apiUrl}/pendencia`, { id_atendimento });
    }
}
