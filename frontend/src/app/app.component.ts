import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
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
  showLayout = false; // Única variável para controlar a visibilidade do layout principal
  user: Usuario | null = null;

  sessionExpired = false;
  private sessionSub: Subscription | undefined;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit() {
    // Escuta as mudanças de rota para atualizar a UI
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.showLayout = this.authService.isLoggedIn();
        if (this.showLayout) {
          this.user = this.authService.getUser();
        } else {
          this.user = null;
        }
      }
    });

    // Lógica para o modal de sessão expirada (a ser implementada no AuthService)
    // this.sessionSub = this.authService.sessionExpired$.subscribe(() => {
    //   this.sessionExpired = true;
    // });
  }

  ngOnDestroy() {
    if (this.sessionSub) {
      this.sessionSub.unsubscribe();
    }
  }

  onModalClose() {
    this.sessionExpired = false;
  }

  /**
   * Verifica se o utilizador tem acesso a uma página/módulo inteiro.
   * Retorna true se o utilizador tiver PELO MENOS UMA permissão que inclua
   * uma das palavras-chave fornecidas.
   */
  temAcessoAPagina(chaves: string[]): boolean {
    if (!this.user || !this.user.Perfil || !this.user.Perfil.Permissoes) {
      return false;
    }
    // Retorna true se encontrar pelo menos uma permissão que corresponda a uma das palavras-chave
    return this.user.Perfil.Permissoes.some(p =>
        chaves.some(chave => p.nome.includes(chave))
    );
  }

  toggleSidebar(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  logout(): void {
    this.authService.logout();
  }
}
