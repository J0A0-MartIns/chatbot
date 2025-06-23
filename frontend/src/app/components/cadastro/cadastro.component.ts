import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html'
})
export class CadastroComponent {
  nome = '';
  email = '';
  senha = '';
  tipoPerfil = 'operador';

  constructor(private auth: AuthService, private router: Router) {}

  cadastrar() {
    const dados = {
      nome: this.nome,
      email: this.email,
      senha: this.senha,
      tipoPerfil: this.tipoPerfil
    };

    this.auth.register(dados).subscribe(() => {
      alert('Cadastro enviado com sucesso!');
      this.router.navigate(['/login']);
    });
  }
}
