import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-gerenciar-usuario',
  templateUrl: './gerir-usuario.component.html',
  styleUrls: ['./gerir-usuario.component.css']
})
export class GerenciarUsuarioComponent {

  constructor(private router: Router) {}

  goToUsers() {
    this.router.navigate(['/usuario']);
  }

  goToRoles() {
    this.router.navigate(['/acesso']);
  }

}
