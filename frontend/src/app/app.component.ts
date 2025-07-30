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
  expiredMessage = '';
  private sessionSub: Subscription | undefined;

  constructor(private authService: AuthService, private router: Router) {
    this.user$ = this.authService.user$;
    this.isLoggedIn$ = this.user$.pipe(map(user => !!user));
  }

  ngOnInit() {
    this.sessionSub = this.authService.sessionExpired$.subscribe((message) => {
      this.expiredMessage = message;
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
  }

  irParaPerfil(): void {
    this.router.navigate(['/perfil']);
  }

  toggleSidebar(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  logout(): void {
    this.authService.logout();
  }
}