import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../environments/environment';
import {Documento} from "../models/documento.model";

export interface PerguntaPayload {
    pergunta: string;
    id_subtema: number;
}

export interface RespostaChat {
    id_atendimento: number;
    solucoes: Documento[];
    encontrado: boolean;
    resposta: string; // A resposta final gerada pela IA
}

export interface FeedbackPayload {
    id_atendimento: number;
    avaliacao: boolean;
    comentario?: string;
}

@Injectable({
    providedIn: 'root'
})
export class ChatService {
    private apiUrl = `${environment.apiUrl}/chat`;

    constructor(private http: HttpClient) {
    }

    perguntar(payload: PerguntaPayload): Observable<RespostaChat> {
        return this.http.post<RespostaChat>(`${this.apiUrl}/perguntar`, payload);
    }

    enviarFeedback(payload: FeedbackPayload): Observable<any> {
        return this.http.post(`${this.apiUrl}/feedback`, payload);
    }

    criarPendenciaDireta(id_atendimento: number): Observable<any> {
        return this.http.post(`${this.apiUrl}/pendencia`, {id_atendimento});
    }
}