import {environment} from "../environments/environment";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({ providedIn: 'root' })
export class ChatbotService {
    private apiUrl = `${environment.apiUrl}/chatbot`;

    constructor(private http: HttpClient) {}

    perguntar(texto: string): Observable<any> {
        return this.http.post(`${this.apiUrl}/perguntar`, { texto_entrada: texto });
    }

    enviarFeedback(atendimento_id: number, avaliacao: boolean): Observable<any> {
        return this.http.post(`${this.apiUrl}/feedback`, { atendimento_id, avaliacao });
    }
}
