import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';

@Component({
    selector: 'app-usuario',
    templateUrl: './usuario.component.html'
})
export class UsuarioComponent implements OnInit {
    usuarios: any[] = [];
    pendentes: any[] = [];

    constructor(private userService: UserService) {}

    ngOnInit() {
        this.carregarUsuarios();
        this.carregarPendentes();
    }

    carregarUsuarios() {
        this.userService.listar().subscribe((res) => {
            this.usuarios = res;
        });
    }

    carregarPendentes() {
        this.userService.listarPendentes().subscribe((res) => {
            this.pendentes = res;
        });
    }

    aprovar(id: number) {
        this.userService.aprovar(id).subscribe(() => {
            this.carregarUsuarios();
            this.carregarPendentes();
        });
    }

    rejeitar(id: number) {
        this.userService.rejeitar(id).subscribe(() => {
            this.carregarPendentes();
        });
    }
}
