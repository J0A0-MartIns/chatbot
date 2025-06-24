import { Component } from '@angular/core';
import {FormsModule} from "@angular/forms";
import {Router, RouterLink} from "@angular/router";
import {AuthService} from "../../../auth/auth.service";

@Component({
  selector: 'app-senha',
  imports: [
    FormsModule,
    RouterLink
  ],
  templateUrl: './senha.component.html',
  styleUrl: '../login.component.css'
})
export class SenhaComponent {
  email = '';
  password = '';

  constructor(private auth: AuthService, private router: Router) {}

  recuperarSenha() {
    if (!this.email) {
      alert('Informe seu e-mail.');
      return;
    }
    const users = this.auth.getUser();
    const user = users.find(u => u.email === this.email);
    if (!user) {
      alert('E-mail não encontrado.');
      return;
    }
    this.auth.setEmailRecuperacao(this.email);
    this.router.navigate(['/novaSenha']);
  }

  voltar() {
    this.router.navigate(['/login']);
  }
}
