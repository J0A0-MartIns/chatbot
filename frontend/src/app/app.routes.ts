import { Routes } from '@angular/router';
import { authGuard } from './auth/auth.guard';


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


export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'cadastro', component: CadastroComponent },
  { path: 'senha', component: SenhaComponent },
  { path: 'esqueci-senha', component: SenhaComponent },
  { path: 'reset-senha', component: NovaSenhaComponent },

  {
    path: '',
    canActivate: [authGuard],
    children: [
      // { path: 'home', component: HomeComponent },
      { path: 'usuario', component: UsuarioComponent },
      { path: 'perfil', component: PerfilComponent },
      { path: 'home', component: DashboardComponent },
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
    ]
  },
  { path: '**', redirectTo: 'login' }
];


