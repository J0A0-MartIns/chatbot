import { Component } from '@angular/core';
import { Router } from "@angular/router";
import { AuthService } from "../../../auth/auth.service";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-senha',
  standalone: true,
  imports: [ CommonModule, FormsModule ],
  templateUrl: './senha.component.html',
  styleUrls: ['../login.component.css']
})
export class SenhaComponent {
  email = '';
  mensagem = '';
  erro = '';
  isLoading = false;

  constructor(private authService: AuthService, private router: Router) {}

  solicitarRecuperacao(): void {
    this.erro = '';
    this.mensagem = '';
    if (!this.email) {
      this.erro = 'Por favor, informe seu e-mail.';
      return;
    }

    this.isLoading = true;
    this.authService.forgotPassword(this.email).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.mensagem = res.message;
      },
      error: (err) => {
        this.isLoading = false;
        this.erro = err.error?.message || 'Ocorreu um erro. Tente novamente.';
      }
    });
  }

  voltarParaLogin(): void {
    this.router.navigate(['/login']);
  }
}
