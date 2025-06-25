import { Routes } from '@angular/router';
import { authGuard } from './auth/auth.guard'; // Importa nosso novo guardião

// Importação dos componentes
import { LoginComponent } from './components/login/login.component';
import { CadastroComponent } from './components/cadastro/cadastro.component';
import { HomeComponent } from './components/home/home.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { BaseComponent } from './components/base/base.component';
import { UsuarioComponent } from './components/usuario/usuario.component';
import { AcessoComponent } from './components/acesso/acesso.component';
import { GerenciarUsuarioComponent } from './components/gerir-usuario/gerir-usuario.component';
import { ChatComponent } from './components/chat/chat.component';
import { PendenciaComponent } from './components/pendencia/pendencia.component';
import { RelatorioComponent } from './components/relatorio/relatorio.component';
import { PerfilComponent } from './components/perfil/perfil.component';
import {SenhaComponent} from "./components/login/senha-form/senha.component";
import {FeedbakcsComponent} from "./components/feedbakcs/feedbakcs.component";
import {NovaSenhaComponent} from "./components/login/nova-senha/nova-senha.component";
// etc...

export const routes: Routes = [
  // Rotas Públicas (não exigem login)
  { path: 'login', component: LoginComponent },
  { path: 'cadastro', component: CadastroComponent },
  { path: 'senha', component: SenhaComponent },

  // Rotas Protegidas (exigem login)
  // Todas as rotas dentro de 'children' serão protegidas pelo authGuard.
  {
    path: '',
    canActivate: [authGuard], // Aplica o guardião a todas as rotas filhas
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'usuario', component: UsuarioComponent },
      { path: 'perfil', component: PerfilComponent },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'base', component: BaseComponent },
      { path: 'login', component: LoginComponent },
      { path: 'cadastro', component: CadastroComponent },
      { path: 'chat', component: ChatComponent },
      { path: 'relatorio', component: RelatorioComponent },
      { path: 'feedback', component: FeedbakcsComponent },
      { path: 'pendencia', component: PendenciaComponent },
      { path: 'acesso', component: AcessoComponent },
      { path: 'gestao', component: GerenciarUsuarioComponent },
      { path: 'novaSenha', component: NovaSenhaComponent },
      { path: '', redirectTo: '/login', pathMatch: 'full' },
      // Rota padrão
      //{ path: '', redirectTo: 'home', pathMatch: 'full' }
    ]
  },
  // Rota para o fallback
  { path: '**', redirectTo: 'login' }
];


