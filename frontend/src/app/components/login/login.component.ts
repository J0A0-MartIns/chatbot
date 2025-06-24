import { Component } from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import { AuthService } from '../../services/auth.service';
import {FormsModule} from "@angular/forms";

@Component({
    selector: 'app-login',
    imports: [
        FormsModule,
        RouterLink
    ],
    templateUrl: './login.component.html'
})
export class LoginComponent {
    email = '';
    password = '';
    erro = '';

    constructor(private authService: AuthService, private router: Router) {}

    login() {
        if (!this.email || !this.password) {
            this.erro = 'Preencha todos os campos.';
            return;
        }

        this.authService.login(this.email, this.password).subscribe({
            next: () => this.router.navigate(['/home']),
            error: () => this.erro = 'Usuário ou senha inválidos.'
        });
    }
}
