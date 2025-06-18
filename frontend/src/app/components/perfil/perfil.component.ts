import {AuthService} from "../../auth/auth.service";
import {UserService} from "../../services/user.service";
import {Component, OnInit} from "@angular/core";
import {User} from "../../models/user.model";
import {FormsModule} from "@angular/forms";
import {NgIf} from "@angular/common";

@Component({
    selector: 'app-perfil',
    templateUrl: './perfil.component.html',
    styleUrls: ['./perfil.component.css'],
    standalone: true,
    imports: [FormsModule, NgIf]
})

export class PerfilComponent implements OnInit {
    user: User | null = null;
    senhaAtual = '';
    novaSenha = '';
    confirmarSenha = '';
    mensagem = '';
    erro = '';
    mostrarTrocaSenha = false;

    constructor(private authService: AuthService, private userService: UserService) {}

    ngOnInit(): void {
        this.user = this.authService.getCurrentUser();
    }

    mostraMudarSenha() {
        this.mostrarTrocaSenha = !this.mostrarTrocaSenha;
        this.mensagem = '';
        this.erro = '';
        this.senhaAtual = '';
        this.novaSenha = '';
        this.confirmarSenha = '';
    }

    mudarSenha() {
        this.mensagem = '';
        this.erro = '';

        if (!this.user) return;

        if (this.senhaAtual !== this.user.password) {
            this.erro = 'Senha atual incorreta.';
            return;
        }

        if (this.novaSenha.length < 6) {
            this.erro = 'A nova senha deve ter pelo menos 6 caracteres.';
            return;
        }

        if (this.novaSenha !== this.confirmarSenha) {
            this.erro = 'A nova senha e confirmação não coincidem.';
            return;
        }

        this.user.password = this.novaSenha;

        const users = this.userService.getUsers();
        const index = users.findIndex(u => u.email === this.user?.email);

        if (index !== -1) {
            users[index] = this.user;
            this.userService.saveUsers(users);
            this.mensagem = 'Senha alterada com sucesso! Faça login novamente.';
            alert('Senha atualizada com sucesso!');
            this.mostraMudarSenha();
        } else {
            this.erro = 'Erro ao atualizar senha.';
        }
    }
}
