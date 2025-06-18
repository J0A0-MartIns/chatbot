import { Component } from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  styleUrls: ['./login.component.css'],
  templateUrl: './login.component.html',
  imports: [
    FormsModule,
    RouterLink
  ]
})
export class LoginComponent {
  email = '';
  password = '';

  constructor(private auth: AuthService, private router: Router) {}

  login() {
    const user = this.auth.login(this.email, this.password);
    if (user) {
      this.router.navigate(['/home']);
      localStorage.setItem('sessionTimestamp', Date.now().toString());
    } else {
      alert('E-mail ou senha inválidos');
    }
  }
}
