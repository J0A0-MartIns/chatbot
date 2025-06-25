import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common'; // Necessário para *ngIf
import { FormsModule } from '@angular/forms';   // Necessário para [(ngModel)]
import { UsuarioPayload } from '../../models/user.model'; // Importa nosso modelo

@Component({
  selector: 'app-cadastro',
  standalone: true, // Seu código sugere que o componente é standalone
  imports: [
    FormsModule,
    RouterLink,
    CommonModule // Adicionado para permitir o uso de *ngIf
  ],
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.css']
})
export class CadastroComponent {
  // Propriedades do formulário
  nome = '';
  email = '';
  senha = '';
  perfilId: number = 2; // Padrão para "Operador" (ID 2)

  // Mensagens para o usuário
  erro = '';
  sucesso = '';
  isLoading = false; // Para desabilitar o botão durante o envio

  constructor(private userService: UserService, private router: Router) {}

  register(): void {
    this.erro = '';
    this.sucesso = '';

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
      next: (response) => {
        this.isLoading = false;
        // O ideal é mostrar uma mensagem de sucesso antes de redirecionar,
        // ou passar uma mensagem para a próxima página.
        alert('Cadastro enviado para aprovação com sucesso!');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.isLoading = false;
        // Pega a mensagem de erro da API, se houver, senão usa uma padrão.
        this.erro = err.error?.message || 'Erro ao cadastrar. Verifique os dados e tente novamente.';
      }
    });
  }
}
