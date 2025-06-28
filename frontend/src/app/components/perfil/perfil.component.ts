import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
// A importação está correta
import { Usuario, TrocarSenhaPayload } from '../../models/usuario.model';
import { AuthService } from '../../auth/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-perfil',
    standalone: true,
    imports: [ CommonModule, FormsModule ],
    templateUrl: './perfil.component.html',
    styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
    user: Usuario | null = null;

    // Propriedades para o formulário de alteração de senha
    senhaAtual = '';
    novaSenha = '';
    confirmarSenha = '';
    erro = '';
    isLoading = false;
    mostrarTrocaSenha = false;

    constructor(
        private userService: UsuarioService,
        private authService: AuthService
    ) {}

    ngOnInit(): void {
        // Busca o utilizador logado através do serviço de autenticação
        this.user = this.authService.getUser();
    }

    /**
     * CORREÇÃO: Função adicionada para mostrar/ocultar o modal de troca de senha
     * e limpar os campos do formulário.
     */
    toggleModalSenha(): void {
        this.mostrarTrocaSenha = !this.mostrarTrocaSenha;
        this.erro = '';
        this.senhaAtual = '';
        this.novaSenha = '';
        this.confirmarSenha = '';
    }

    /**
     * CORREÇÃO: Função adicionada para lidar com a submissão do formulário de nova senha.
     * Ela valida os campos e chama o serviço para alterar a senha.
     */
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
            this.erro = 'Não foi possível identificar o utilizador. Por favor, faça login novamente.';
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
                this.toggleModalSenha(); // Fecha o modal
            },
            error: (err) => {
                this.isLoading = false;
                this.erro = err.error?.mensagem || 'Erro ao alterar a senha. Verifique se a senha atual está correta.';
            }
        });
    }
}
