import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { NgIf } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from './auth/auth.service';
import { User } from './models/user.model';
import {AlertModalComponent} from "./components/alerta/alerta.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NgIf, RouterLink, RouterLinkActive, FormsModule, AlertModalComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'prototipo-chatbot';
  isCollapsed = false;
  showSidebar = true;
  showTopbar = true;
  isLoginPage = false;
  isHomePage = false;
  expired = false;
  expiredMessage = '';
  sessionExpiredHandled = false;

  user: User | null = null;

  constructor(private router: Router, private authService: AuthService) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const currentUrl = event.urlAfterRedirects;

        this.isLoginPage = ['/login', '/cadastro', '/senha', '/novaSenha'].includes(currentUrl);
        this.isHomePage = ['/home'].includes(currentUrl);
        this.showSidebar = !this.isLoginPage && !this.isHomePage;
        this.showTopbar = !this.isLoginPage;
      }
    });
  }

  ngOnInit() {
    this.user = this.authService.getCurrentUser();

    setInterval(() => {
      const user = this.authService.getCurrentUser();

      if (!user && !this.expired && !this.sessionExpiredHandled) {
        this.expiredMessage = 'Sua sessão expirou por inatividade. Faça login novamente.';
        this.expired = true;
        this.sessionExpiredHandled = true;
      }

      if (user && this.expired) {
        this.expired = false;
        this.expiredMessage = '';
        this.sessionExpiredHandled = false;
      }
    }, 10000);
  }

  onModalClose() {
    this.expired = false;
    this.expiredMessage = '';
    if (!this.authService.getCurrentUser()) {
      this.authService.logout();
    }
    this.router.navigate(['/login']);
  }

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

}
