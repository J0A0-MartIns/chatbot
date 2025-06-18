import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-gerenciar',
  templateUrl: './gerir-usuario.component.html',
  styleUrls: ['./gerir-usuario.component.css']
})
export class GerenciarComponent {
  constructor(private router: Router) {}

  goToUsers() {
    this.router.navigate(['/usuario']);
  }

  goToRoles() {
    this.router.navigate(['/acessos']);
  }
}
