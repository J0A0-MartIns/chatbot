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
    console.log(`--- A verificar acesso para as chaves: [${chaves.join(', ')}] ---`);

    if (!this.user || !this.user.Perfil || !this.user.Perfil.Permissoes || this.user.Perfil.Permissoes.length === 0) {
      console.log('-> Acesso negado: O objeto user, Perfil ou a lista de Permissaos está vazia ou ausente.');
      return false;
    }

    // Mostra todas as permissões que o utilizador tem
    const nomesPermissoes = this.user.Perfil.Permissoes.map(p => p.nome);
    console.log('A verificar contra as seguintes permissões do utilizador:', nomesPermissoes);

    const temAcesso = this.user.Perfil.Permissoes.some(permissao => {
      // Garante que a propriedade 'nome' existe e a converte para minúsculas
      const nomePermissao = (permissao.nome || '').toLowerCase();

      // Itera sobre as chaves de busca (ex: 'usuario', 'perfi')
      return chaves.some(chave => {
        const resultado = nomePermissao.includes(chave.toLowerCase());
        // Mostra cada comparação individual
        // console.log(`A comparar "${nomePermissao}" com a chave "${chave}": ${resultado}`);
        if (resultado) {
          console.log(`%c-> MATCH ENCONTRADO! A permissão "${nomePermissao}" inclui a chave "${chave}".`, 'color: green; font-weight: bold;');
        }
        return resultado;
      });
    });

    console.log(`-> Resultado final para [${chaves.join(', ')}]: ${temAcesso}`);
    return temAcesso;
  }

  toggleSidebar(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  logout(): void {
    this.authService.logout();
  }
}
