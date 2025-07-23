import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [
        FormsModule,
        RouterLink,
        CommonModule
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
                this.router.navigate(['/chat']);
            },
            error: (err) => {
                this.isLoading = false;
                this.erro = err.error?.message || 'Usuário ou senha inválidos. Tente novamente.';
            }
        });
    }
}
