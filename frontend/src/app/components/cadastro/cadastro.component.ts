import { Component } from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import { UserService } from '../../services/user.service';
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-cadastro',
  imports: [
    FormsModule,
    RouterLink
  ],
  templateUrl: './cadastro.component.html'
})
export class CadastroComponent {
  name = '';
  email = '';
  password = '';
  role = 'Operador'; // valor inicial
  erro = '';
  sucesso = '';

  constructor(private userService: UserService, private router: Router) {}

  register() {
    if (!this.name || !this.email || !this.password || !this.role) {
      this.erro = 'Preencha todos os campos.';
      return;
    }

    const idPerfil = this.role === 'Administrador' ? 1 : 2;

    this.userService.registrar({
      nome: this.name,
      email: this.email,
      senha: this.password,
      id_perfil: idPerfil
    }).subscribe({
      next: () => {
        this.sucesso = 'Cadastro enviado para aprovação!';
        this.router.navigate(['/login']);
      },
      error: () => {
        this.erro = 'Erro ao cadastrar. Verifique os dados.';
      }
    });
  }
}
