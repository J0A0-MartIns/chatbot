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
export class NovaSenhaComponent implements OnInit {
  novaSenha = '';
  confirmarSenha = '';
  token: string | null = null;

  mensagem = '';
  erro = '';
  isLoading = false;

  constructor(
      private route: ActivatedRoute,
      private router: Router,
      private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token');
    if (!this.token) {
      alert('Token de recuperação não encontrado ou inválido. Por favor, solicite a recuperação novamente.');
      this.router.navigate(['/login']);
    }
  }

  redefinirSenha(): void {
    this.erro = '';
    this.mensagem = '';

    if (!this.novaSenha || !this.confirmarSenha) {
      this.erro = 'Por favor, preencha todos os campos.';
      return;
    }
    if (this.novaSenha !== this.confirmarSenha) {
      this.erro = 'As senhas não coincidem.';
      return;
    }
    if (!this.token) {
      this.erro = 'Token de recuperação inválido.';
      return;
    }

    this.isLoading = true;
    this.authService.resetPassword(this.token, this.novaSenha).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.mensagem = res.message || 'Senha redefinida com sucesso! Você já pode fazer o login.';
        setTimeout(() => this.router.navigate(['/login']), 4000);
      },
      error: (err) => {
        this.isLoading = false;
        this.erro = err.error?.message || 'Ocorreu um erro. O token pode ter expirado.';
      }
    });
  }
}
