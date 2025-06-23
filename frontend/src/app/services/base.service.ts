import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class BaseService {
    private api = 'http://localhost:3000/api/documento';

    constructor(private http: HttpClient) {}

    listar() {
        return this.http.get<any[]>(this.api);
    }

    buscar(termo: string) {
        return this.http.get<any[]>(`${this.api}/buscar?termo=${termo}`);
    }

    criar(doc: any, arquivo: File | null) {
        const form = new FormData();
        form.append('dados', JSON.stringify(doc));
        if (arquivo) form.append('arquivo', arquivo);
        return this.http.post(this.api, form);
    }

    atualizar(id: number, doc: any) {
        return this.http.put(`${this.api}/${id}`, doc);
    }

    excluir(id: number) {
        return this.http.delete(`${this.api}/${id}`);
    }
}
