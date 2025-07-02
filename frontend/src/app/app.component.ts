import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { AuthService } from './auth/auth.service';
import { Usuario } from './models/usuario.model';
import { AlertModalComponent } from './components/alerta/alerta.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, AlertModalComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  isCollapsed = false;
  user$: Observable<Usuario | null>;
  isLoggedIn$: Observable<boolean>;
  sessionExpired = false;
  private sessionSub: Subscription | undefined;

  constructor(private authService: AuthService, private router: Router) {
    this.user$ = this.authService.user$;
    this.isLoggedIn$ = this.user$.pipe(map(user => !!user));
  }

  ngOnInit() {
    this.sessionSub = this.authService.sessionExpired$.subscribe(() => {
      this.sessionExpired = true;
    });
  }

  ngOnDestroy() {
    if (this.sessionSub) {
      this.sessionSub.unsubscribe();
    }
  }

  onModalClose() {
    this.sessionExpired = false;
    this.authService.logout();
  }

  /**
   * Verifica se o usuário tem acesso a uma página.
   */
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