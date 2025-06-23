import { Routes } from '@angular/router';
import {BaseComponent} from './components/base/base.component';
import {UsuarioComponent} from './components/usuario/usuario.component';
import {PerfilComponent} from './components/perfil/perfil.component';
import {DashboardComponent} from './components/dashboard/dashboard.component';
import {LoginComponent} from './components/login/login.component';
import {CadastroComponent} from './components/cadastro/cadastro.component';
import {ChatbotComponent} from "./components/chat/chat.component";
import {SenhaComponent} from "./components/login/senha-form/senha.component";
import {RelatorioComponent} from "./components/relatorio/relatorio.component";
import {FeedbakcsComponent} from "./components/feedbakcs/feedbakcs.component";
import {HomeComponent} from "./components/home/home.component";
import {PendenciaComponent} from "./components/pendencia/pendencia.component";
import {AcessoComponent} from "./components/acesso/acesso.component";
import {GerenciarComponent} from "./components/gerir-usuario/gerir-usuario.component";
import {NovaSenhaComponent} from "./components/login/nova-senha/nova-senha.component";

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'usuario', component: UsuarioComponent },
  { path: 'perfil', component: PerfilComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'base', component: BaseComponent },
  { path: 'login', component: LoginComponent },
  { path: 'cadastro', component: CadastroComponent },
  { path: 'chat', component: ChatbotComponent },
  { path: 'senha', component: SenhaComponent },
  { path: 'relatorio', component: RelatorioComponent },
  { path: 'feedback', component: FeedbakcsComponent },
  { path: 'pendencias', component: PendenciaComponent },
  { path: 'acessos', component: AcessoComponent },
  { path: 'gestao', component: GerenciarComponent },
  { path: 'novaSenha', component: NovaSenhaComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];
