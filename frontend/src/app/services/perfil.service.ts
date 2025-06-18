import { Injectable } from '@angular/core';
import { PerfilAcesso } from '../models/perfil.model';

@Injectable({ providedIn: 'root' })
export class PerfilAcessoService {
    private chaveStorage = 'perfisAcesso';

    constructor() {
        this.inicializarPerfisPadrao();
    }

    private inicializarPerfisPadrao() {
        const armazenado = localStorage.getItem(this.chaveStorage);
        if (!armazenado) {
            const perfisPadrao: PerfilAcesso[] = [
                {
                    nome: 'Administrador',
                    permissoes: {
                        acessaGerirUsuarios: true,
                        acessaDashboard: true,
                        acessaBase: true,
                        acessaChat: true,
                    }
                },
                {
                    nome: 'Operador',
                    permissoes: {
                        acessaGerirUsuarios: false,
                        acessaDashboard: false,
                        acessaBase: false,
                        acessaChat: true,
                    }
                }
            ];
            localStorage.setItem(this.chaveStorage, JSON.stringify(perfisPadrao));
        }
    }

    obterPerfis(): PerfilAcesso[] {
        return JSON.parse(localStorage.getItem(this.chaveStorage) || '[]');
    }

    adicionarPerfil(perfil: PerfilAcesso) {
        const perfis = this.obterPerfis();
        perfis.push(perfil);
        localStorage.setItem(this.chaveStorage, JSON.stringify(perfis));
    }

    atualizarPerfil(indice: number, perfilAtualizado: PerfilAcesso) {
        const perfis = this.obterPerfis();
        perfis[indice] = perfilAtualizado;
        localStorage.setItem(this.chaveStorage, JSON.stringify(perfis));
    }

    excluirPerfil(indice: number) {
        const perfis = this.obterPerfis();
        perfis.splice(indice, 1);
        localStorage.setItem(this.chaveStorage, JSON.stringify(perfis));
    }
}
