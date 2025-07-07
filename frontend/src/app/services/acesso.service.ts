// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
//
// export interface PerfilRequest {
//     nome: string;
//     permissoes: string[];
// }
//
// @Injectable({
//     providedIn: 'root'
// })
// export class AcessoService {
//     private apiUrl = 'http://localhost:3000/api/acesso';
//
//     constructor(private http: HttpClient) {}
//
//     // getPerfisComPermissoes(): Observable<any[]> {
//     //     return this.http.get<any[]>(this.apiUrl);
//     // }
//     //
//     // criarPerfil(perfil: PerfilRequest): Observable<any> {
//     //     return this.http.post(this.apiUrl, perfil);
//     // }
//     //
//     // atualizarPerfil(id: number, perfil: PerfilRequest): Observable<any> {
//     //     return this.http.put(`${this.apiUrl}/${id}`, perfil);
//     // }
//     //
//     // excluirPerfil(id: number): Observable<any> {
//     //     return this.http.delete(`${this.apiUrl}/${id}`);
//     // }
// }
