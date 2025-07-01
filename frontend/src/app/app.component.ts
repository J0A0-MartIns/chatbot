import { Component } from '@angular/core';
import { Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { AuthService } from './auth/auth.service';
import { Usuario } from './models/usuario.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  isCollapsed = false;
  user$: Observable<Usuario | null>;
  isLoggedIn$: Observable<boolean>;

  constructor(private authService: AuthService, private router: Router) {
    this.user$ = this.authService.user$;
    this.isLoggedIn$ = this.user$.pipe(map(user => !!user));
  }

  // temAcessoAPagina(user: Usuario | null, chaves: string[]): boolean {
  //   if (!user || !user.Perfil || !user.Perfil.Permissoes || user.Perfil.Permissoes.length === 0) {
  //     return false;
  //   }
  //   return user.Perfil.Permissoes.some(p =>
  //       chaves.some(chave => (p.nome || '').toLowerCase().includes(chave.toLowerCase()))
  //   );
  // }

  toggleSidebar(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  logout(): void {
    this.authService.logout();
  }
}