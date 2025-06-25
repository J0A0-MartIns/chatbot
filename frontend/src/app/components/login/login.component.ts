import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { CommonModule } from '@angular/common'; // Importado para usar *ngIf
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-login',
    standalone: true, // Seu código sugere que o componente é standalone
    imports: [
        FormsModule,
        RouterLink,
        CommonModule // Essencial para exibir a mensagem de erro com *ngIf
    ],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent {
    email = '';
    senha = '';
    erro = '';
    isLoading = false;

    constructor(private authService: AuthService, private router: Router) {}

    login(): void {
        this.erro = '';
        if (!this.email || !this.senha) {
            this.erro = 'Por favor, preencha o e-mail e a senha.';
            return;
        }

        this.isLoading = true;
        this.authService.login(this.email, this.senha).subscribe({
            next: () => {
                this.isLoading = false;
                // Redireciona para a página principal após o login bem-sucedido
                this.router.navigate(['/home']);
            },
            error: (err) => {
                this.isLoading = false;
                // Exibe a mensagem de erro específica vinda da API
                this.erro = err.error?.message || 'Usuário ou senha inválidos. Tente novamente.';
            }
        });
    }
}
