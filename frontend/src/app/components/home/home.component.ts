import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { Usuario } from '../../models/user.model'; // Importa o modelo CORRIGIDO
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  // A variável user agora é do tipo Usuario, que inclui a propriedade Perfil
  user: Usuario | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.user = this.authService.getUser();
  }

  irPara(caminho: string): void {
    this.router.navigate([`/${caminho}`]);
  }

  irParaPerfil(): void {
    this.router.navigate(['/acesso']);
  }
}
