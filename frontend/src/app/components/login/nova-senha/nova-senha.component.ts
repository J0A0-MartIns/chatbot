import { Component, OnInit } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'app-nova-senha',
  imports: [FormsModule],
  templateUrl: './nova-senha.component.html',
  styleUrl: '../login.component.css'
})
export class NovaSenhaComponent implements OnInit {
  password = '';
  confirmPassword = '';
  email: string | null = null;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit() {
    this.email = this.authService.getEmailRecuperacao();
    if (!this.email) {
      alert('Sessão de recuperação expirada. Volte e solicite novamente.');
      this.router.navigate(['/senha']);
    }
  }
  salvarNovaSenha() {
    if (!this.email) return;
    if (this.password !== this.confirmPassword) {
      alert('As senhas não coincidem.');
      return;
    }
    const users = this.authService.getUsers();
    const index = users.findIndex(u => u.email === this.email);
    users[index].password = this.password;
    localStorage.setItem('usuarios', JSON.stringify(users));
    this.authService.limparEmailRecuperacao();
    alert('Senha alterada com sucesso!');
    this.router.navigate(['/login']);
  }
}
