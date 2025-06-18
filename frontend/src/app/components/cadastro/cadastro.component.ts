import { Component } from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { User } from '../../models/user.model';
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-cadastro',
  styleUrls: ['./cadastro.component.css'],
  templateUrl: './cadastro.component.html',
  imports: [
    RouterLink,
    FormsModule
  ]
})
export class CadastroComponent {
  name = '';
  email = '';
  password = '';
  role: 'Administrador' | 'Operador' = 'Operador';

  constructor(private auth: AuthService, private router: Router) {}

  register() {
    const newUser: User = {
      name: this.name.trim(),
      email: this.email.trim(),
      password: this.password,
      role: this.role
    };

    const pendingUsers = JSON.parse(localStorage.getItem('pendingUsers') || '[]');
    pendingUsers.push(newUser);
    localStorage.setItem('pendingUsers', JSON.stringify(pendingUsers));

    alert('Cadastro enviado para aprovação!');
    this.router.navigate(['/login']);
  }

  // register() {
  //   const newUser: User = {
  //     name: this.name.trim(),
  //     email: this.email.trim(),
  //     password: this.password,
  //     role: this.role
  //   };
  //   const success = this.auth.saveUser(newUser);
  //
  //   if (success) {
  //     alert('Usuário cadastrado com sucesso!');
  //     this.router.navigate(['/login']);
  //   } else {
  //     alert('E-mail já cadastrado!');
  //   }
  // }
}
