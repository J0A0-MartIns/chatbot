import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-gerenciar-usuario',
  templateUrl: './gerenciar-usuario.component.html',
  styleUrls: ['./gerenciar-usuario.component.css']
})
export class GerenciarUsuarioComponent {

  constructor(private router: Router) {}

  goToUsers() {
    this.router.navigate(['/usuarios']);
  }

  goToRoles() {
    this.router.navigate(['/acesso']);
  }

}
