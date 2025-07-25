import { Component, OnInit } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import {AuthService, ResetPasswordPayload} from '../../../auth/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-nova-senha',
  standalone: true,
  imports: [ FormsModule, CommonModule ],
  templateUrl: './nova-senha.component.html',
  styleUrls: ['../login.component.css']
})
export class NovaSenhaComponent {
  email = '';
  code = '';
  novaSenha = '';
  confirmarSenha = '';

  mensagem = '';
  erro = '';
  isLoading = false;

  constructor(
      private route: ActivatedRoute,
      private router: Router,
      private authService: AuthService
  ) {}

  redefinirSenha(): void {
    this.erro = '';
    this.mensagem = '';

    if (!this.email || !this.code || !this.novaSenha || !this.confirmarSenha) {
      this.erro = 'Por favor, preencha todos os campos.';
      return;
    }
    if (this.novaSenha !== this.confirmarSenha) {
      this.erro = 'As senhas não coincidem.';
      return;
    }

    this.isLoading = true;
    const payload: ResetPasswordPayload = {
      email: this.email,
      code: this.code,
      senha: this.novaSenha
    };

    this.authService.resetPassword(payload).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.mensagem = res.message || 'Senha redefinida com sucesso! Você já pode fazer o login.';
        setTimeout(() => this.router.navigate(['/login']), 4000);
      },
      error: (err) => {
        this.isLoading = false;
        this.erro = err.error?.message || 'Ocorreu um erro. Verifique o e-mail e o código, ou solicite um novo.';
      }
    });
  }
}
