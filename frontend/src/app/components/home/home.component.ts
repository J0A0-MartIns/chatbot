import {Component, OnDestroy, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { AuthService } from '../../auth/auth.service';
import { User } from '../../models/user.model';
import {FormsModule} from "@angular/forms";
import {UserService} from "../../services/user.service";

@Component({
  selector: 'app-home',
  standalone: true,
    imports: [NgIf, FormsModule],
  styleUrls: ['./home.component.css'],
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  user: User | null = null;
  perfilExpandido = false;

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.user = this.auth.getCurrentUser();
  }

  irParaPerfil(): void {
    this.router.navigate(['/perfil']);
  }

  irPara(rota: string): void {
    switch (rota) {
      case 'chat':
        this.router.navigate(['/chat']);
        break;
      case 'gestao':
        this.router.navigate(['/gestao']);
        break;
      case 'dashboard':
        this.router.navigate(['/dashboard']);
        break;
      case 'base':
        this.router.navigate(['/base']);
        break;
    }
  }

}
