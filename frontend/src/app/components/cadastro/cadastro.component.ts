import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';
import { PerfilService } from '../../services/perfil.service';
import { UsuarioPayload } from '../../models/usuario.model';
import { Perfil } from '../../models/perfil.model';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [ FormsModule, RouterLink, CommonModule ],
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.css']
})
export class CadastroComponent implements OnInit {
  nome = '';
  email = '';
  senha = '';
  perfilId: number | null = null;
  perfisDisponiveis: Perfil[] = [];
  erro = '';
  isLoading = false;

  constructor(
      private userService: UsuarioService,
      private perfilService: PerfilService,
      private router: Router
  ) {}

  ngOnInit(): void {
    this.carregarPerfis();
  }

  carregarPerfis(): void {
    this.perfilService.getPerfis().subscribe({
      next: (data) => {
        this.perfisDisponiveis = data;
      },
      error: () => {
        this.erro = 'Não foi possível carregar os perfis disponíveis.';
      }
    });
  }

  register(): void {
    this.erro = '';
    if (!this.nome || !this.email || !this.senha || !this.perfilId) {
      this.erro = 'Por favor, preencha todos os campos.';
      return;
    }

    this.isLoading = true;
    const payload: UsuarioPayload = {
      nome: this.nome,
      email: this.email,
      senha: this.senha,
      id_perfil: this.perfilId
    };

    this.userService.registrar(payload).subscribe({
      next: () => {
        this.isLoading = false;
        alert('Cadastro enviado para aprovação com sucesso!');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.isLoading = false;
        this.erro = err.error?.message || 'Erro ao registar. Verifique os dados e tente novamente.';
      }
    });
  }
}
