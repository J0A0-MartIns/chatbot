import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent {
  email = '';
  senha = '';
  erro = '';

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    this.auth.login(this.email, this.password).subscribe({
      next: res => {
        this.auth.saveSession(res.token, res.user);
        this.router.navigate(['/home']);
      },
      error: err => {
        alert('E-mail ou senha inválidos');
      }
    });
  }

}
}
