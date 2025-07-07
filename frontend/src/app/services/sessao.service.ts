import {Injectable} from "@angular/core";
import {environment} from "../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({ providedIn: 'root' })
export class SessaoService {
    private apiUrl = `${environment.apiUrl}/sessoes`;

    constructor(private http: HttpClient) {}

    // listarPorUsuario(id: number): Observable<any[]> {
    //     return this.http.get<any[]>(`${this.apiUrl}/usuario/${id}`);
    // }
    //
    // logout(): Observable<any> {
    //     return this.http.post(`${this.apiUrl}/logout`, {});
    // }
}
