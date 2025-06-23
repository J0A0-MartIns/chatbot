import {Observable} from "rxjs";
import {Injectable} from "@angular/core";
import {environment} from "../environments/environment";
import {HttpClient} from "@angular/common/http";

@Injectable({ providedIn: 'root' })
export class DashboardService {
    private apiUrl = `${environment.apiUrl}/dashboard`;

    constructor(private http: HttpClient) {}

    resumo(): Observable<any> {
        return this.http.get(`${this.apiUrl}`);
    }
}
