import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../environments/environment';
import {PerguntaPayload, RespostaChat, FeedbackPayload} from "../models/chat.model";


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