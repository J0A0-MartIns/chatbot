import { Component, OnInit } from '@angular/core'; // Importa OnInit
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { PerfilService } from '../../services/perfil.service'; // <-- 1. Importa o PerfilService
import { UsuarioPayload } from '../../models/usuario.model';
import { Perfil } from '../../models/perfil.model'; // Importa o modelo de Perfil

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [ FormsModule, RouterLink, CommonModule ],
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.css']
})
export class CadastroComponent implements OnInit { // Implementa OnInit
  // Propriedades do formulário
  nome = '';
  email = '';
  senha = '';
  perfilId: number | null = null; // Inicia como nulo para forçar uma seleção

  // Propriedade para guardar a lista de perfis vinda da API
  perfisDisponiveis: Perfil[] = [];

  // Mensagens para o utilizador
  erro = '';
  isLoading = false;

  constructor(
      private userService: UserService,
      private perfilService: PerfilService, // <-- 2. Injeta o serviço
      private router: Router
  ) {}

  ngOnInit(): void {
    // 3. Busca os perfis assim que o componente é iniciado
    this.carregarPerfis();
  }

  carregarPerfis(): void {
    this.perfilService.getPerfis().subscribe({
      next: (data) => {
        // Filtra para não mostrar o perfil 'Admin' na tela de cadastro público, se desejar
        this.perfisDisponiveis = data.filter(p => p.nome !== 'Admin');
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
