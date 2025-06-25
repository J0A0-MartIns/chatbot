import { Component, OnInit } from '@angular/core';
import { UserService, TrocarSenhaPayload } from '../../services/user.service';
import { AuthService } from '../../auth/auth.service';
import { Usuario } from '../../models/user.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-perfil',
    standalone: true, // Adicionado para consistência
    imports: [
        CommonModule, // Para *ngIf
        FormsModule   // Para [(ngModel)]
    ],
    templateUrl: './perfil.component.html',
    styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
    user: Usuario | null = null;

    // Propriedades para o formulário de troca de senha
    senhaAtual = '';
    novaSenha = '';
    confirmarSenha = '';
    erro = '';
    isLoading = false;
    mostrarTrocaSenha = false;

    constructor(
        private userService: UserService,
        private authService: AuthService // Usamos o AuthService para obter o usuário logado
    ) {}

    ngOnInit(): void {
        // CORREÇÃO: Pega o usuário do AuthService, que é a fonte da verdade.
        this.user = this.authService.getUser();
    }

    toggleFormularioSenha(): void {
        this.mostrarTrocaSenha = !this.mostrarTrocaSenha;
        // Reseta o formulário ao abrir/fechar
        this.erro = '';
        this.senhaAtual = '';
        this.novaSenha = '';
        this.confirmarSenha = '';
    }

    mudarSenha(): void {
        this.erro = '';
        if (!this.senhaAtual || !this.novaSenha || !this.confirmarSenha) {
            this.erro = 'Por favor, preencha todos os campos.';
            return;
        }
        if (this.novaSenha !== this.confirmarSenha) {
            this.erro = 'A nova senha e a confirmação não coincidem.';
            return;
        }
        if (!this.user?.id_usuario) {
            this.erro = 'Não foi possível identificar o usuário.';
            return;
        }

        this.isLoading = true;
        const payload: TrocarSenhaPayload = {
            senhaAtual: this.senhaAtual,
            novaSenha: this.novaSenha
        };

        this.userService.trocarSenha(this.user.id_usuario, payload).subscribe({
            next: () => {
                this.isLoading = false;
                alert('Senha alterada com sucesso!');
                this.toggleFormularioSenha(); // Fecha o modal
            },
            error: (err) => {
                this.isLoading = false;
                this.erro = err.error?.mensagem || 'Erro ao alterar senha. Verifique a senha atual.';
            }
        });
    }
}
