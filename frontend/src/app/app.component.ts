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
  showLayout = false;
  user: Usuario | null = null;

  sessionExpired = false;
  private sessionSub: Subscription | undefined;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit() {
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
   * CORREÇÃO: Adicionada depuração detalhada para ver o que a função está a fazer.
   */
  temAcessoAPagina(chaves: string[]): boolean {

    if (!this.user || !this.user.Perfil || !this.user.Perfil.Permissoes || this.user.Perfil.Permissoes.length === 0) {
      return false;
    }


    // Mostra todas as permissões
    const nomesPermissoes = this.user.Perfil.Permissoes.map(p => p.nome);

    const temAcesso = this.user.Perfil.Permissoes.some(permissao => {
      // Garante que a propriedade 'nome' existe e a converte para minúsculas
      const nomePermissao = (permissao.nome || '').toLowerCase();

      // Itera sobre as chaves de busca (ex: 'usuario', 'perfi')
      return chaves.some(chave => {
        const resultado = nomePermissao.includes(chave.toLowerCase());

        return resultado;
      });
    });

    return temAcesso;
  }

  toggleSidebar(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  logout(): void {
    this.authService.logout();
  }
}
