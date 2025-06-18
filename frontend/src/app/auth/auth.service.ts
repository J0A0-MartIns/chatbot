import {Injectable} from '@angular/core';
import {User} from '../models/user.model';
import { PerfilAcessoService } from '../services/perfil.service';

@Injectable({providedIn: 'root'})
export class AuthService {
    private localStorageKey = 'usuarios';
    private currentUserKey = 'currentUser';
    private sessionTimeoutMinutes = 1;
    private sessionTimestampKey = 'sessionTimestamp';
    private sessionTokenKey = 'sessionToken';
    private emailRecuperacaoKey = 'recuperacaoEmail';

    constructor(private perfilService: PerfilAcessoService) {}

    getUsers(): User[] {
        const usersJson = localStorage.getItem(this.localStorageKey);
        return usersJson ? JSON.parse(usersJson) : [];
    }

    private generateToken(length = 16): string {
        const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    }

    // saveUser(user: User): boolean {
    //     const users = this.getUsers();
    //
    //     const exists = users.some(u => u.email === user.email);
    //     if (exists) return false; // já cadastrado
    //
    //     users.push(user);
    //     localStorage.setItem(this.localStorageKey, JSON.stringify(users));
    //     return true;
    // }

    login(email: string, password: string): User | null {
        const users = this.getUsers();
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            const currentUserJson = localStorage.getItem(this.currentUserKey);
            if (currentUserJson) {
                const currentUser = JSON.parse(currentUserJson);
                if (currentUser.email === email) {
                    alert('Este usuário já está com uma sessão ativa.');
                    return null;
                }
            }

            const token = this.generateToken();

            const perfis = this.perfilService.obterPerfis();
            const perfil = perfis.find(p => p.nome === user.role);
            user.permissoes = perfil ? perfil.permissoes : {
                acessaDashboard: false,
                acessaBase: false,
                acessaChat: false,
                acessaGerirUsuarios: false
            };

            localStorage.setItem(this.currentUserKey, JSON.stringify(user));
            localStorage.setItem(this.sessionTokenKey, token);
            localStorage.setItem(this.sessionTimestampKey, Date.now().toString());
            return user;
        }
        return null;
    }


    getCurrentUser(): User | null {
        const timestamp = localStorage.getItem(this.sessionTimestampKey);
        if (timestamp) {
            const now = Date.now();
            const elapsed = now - parseInt(timestamp, 10);
            const maxTime = this.sessionTimeoutMinutes * 60 * 1000;

            if (elapsed > maxTime) {
                return null;
            } else {
                localStorage.setItem(this.sessionTimestampKey, now.toString());
            }
        }

        const userJson = localStorage.getItem(this.currentUserKey);
        if (!userJson) return null;

        const user: User = JSON.parse(userJson);
        if (!user.permissoes) {
            const perfis = this.perfilService.obterPerfis();
            const perfil = perfis.find(p => p.nome === user.role);
            user.permissoes = perfil ? perfil.permissoes : {
                acessaDashboard: false,
                acessaBase: false,
                acessaChat: false,
                acessaGerirUsuarios: false
            };
        }
        return user;
    }

    logout() {
        localStorage.removeItem(this.currentUserKey);
        localStorage.removeItem(this.sessionTimestampKey);
        localStorage.removeItem(this.sessionTokenKey);
    }

    setEmailRecuperacao(email: string) {
        localStorage.setItem(this.emailRecuperacaoKey, email);
    }

    getEmailRecuperacao(): string | null {
        return localStorage.getItem(this.emailRecuperacaoKey);
    }

    limparEmailRecuperacao() {
        localStorage.removeItem(this.emailRecuperacaoKey);
    }


    // mudarSenha(senhaAtual: string, novaSenha: string): Promise<void> {
    //     return new Promise((resolve, reject) => {
    //         const currentUser = this.getCurrentUser();
    //         if (!currentUser) {
    //             reject(new Error('Nenhum usuário logado'));
    //             return;
    //         }
    //
    //         if (currentUser.password !== senhaAtual) {
    //             reject(new Error('Senha atual incorreta'));
    //             return;
    //         }
    //         const users = this.getUsers();
    //
    //         const index = users.findIndex(u => u.email === currentUser.email);
    //         if (index === -1) {
    //             reject(new Error('Usuário não encontrado'));
    //             return;
    //         }
    //
    //         users[index].password = novaSenha;
    //
    //         localStorage.setItem(this.localStorageKey, JSON.stringify(users));
    //
    //         currentUser.password = novaSenha;
    //         localStorage.setItem(this.currentUserKey, JSON.stringify(currentUser));
    //         resolve();
    //     });
    // }
}
