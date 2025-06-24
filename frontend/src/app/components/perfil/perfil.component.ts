import { Component, OnInit } from '@angular/core';
import { UserService, Usuario } from '../../services/user.service';
import {NgIf} from "@angular/common";
import {FormsModule} from "@angular/forms";

@Component({
    selector: 'app-perfil',
    templateUrl: './perfil.component.html',
    imports: [
        NgIf,
        FormsModule
    ],
    styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
    user: Usuario | null = null;

    senhaAtual: string = '';
    novaSenha: string = '';
    confirmarSenha: string = '';
    erro: string = '';
    mostrarTrocaSenha: boolean = false;

    constructor(private userService: UserService) {}

    ngOnInit(): void {
        const dadosUsuario = localStorage.getItem('usuario');
        if (dadosUsuario) {
            this.user = JSON.parse(dadosUsuario);
        }
    }

    mostraMudarSenha(): void {
        this.mostrarTrocaSenha = !this.mostrarTrocaSenha;
        this.erro = '';
        this.senhaAtual = '';
        this.novaSenha = '';
        this.confirmarSenha = '';
    }

    mudarSenha(): void {
        if (!this.senhaAtual || !this.novaSenha || !this.confirmarSenha) {
            this.erro = 'Preencha todos os campos.';
            return;
        }

        if (this.novaSenha !== this.confirmarSenha) {
            this.erro = 'As senhas não coincidem.';
            return;
        }

        if (this.user?.id_usuario) {
            const payload = {
                senhaAtual: this.senhaAtual,
                novaSenha: this.novaSenha
            };

            this.userService.trocarSenha(this.user.id_usuario, payload).subscribe({
                next: () => {
                    alert('Senha alterada com sucesso!');
                    this.mostraMudarSenha();
                },
                error: () => {
                    this.erro = 'Erro ao alterar senha. Verifique a senha atual.';
                }
            });
        }
    }
}
