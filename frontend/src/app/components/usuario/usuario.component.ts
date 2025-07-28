import {Component, OnInit} from '@angular/core';
import {UsuarioService} from '../../services/usuario.service';
import {PerfilService} from '../../services/perfil.service';
import {Usuario, UsuarioPayload} from '../../models/usuario.model';
import {Perfil} from '../../models/perfil.model';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {RouterLink} from "@angular/router";

@Component({
    selector: 'app-usuario',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink],
    templateUrl: './usuario.component.html',
    styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit {
    usuariosAtivos: Usuario[] = [];
    usuariosPendentes: Usuario[] = [];
    perfis: Perfil[] = [];
    termoBusca = '';
    showUserModal = false;
    showPendingModal = false;
    isEditMode = false;
    openActionIndex: number | null = null;
    usuarioEmEdicao: Partial<UsuarioPayload> & { id?: number } = {};

    constructor(
        private userService: UsuarioService,
        private perfilService: PerfilService
    ) {
    }

    ngOnInit(): void {
        this.carregarDados();
    }

    carregarDados(): void {
        this.userService.getUsuarios().subscribe(data => this.usuariosAtivos = data);
        this.userService.getUsuariosPendentes().subscribe(data => this.usuariosPendentes = data);
        this.perfilService.getPerfis().subscribe(data => this.perfis = data);
    }

    usuariosFiltrados(): Usuario[] {
        if (!this.termoBusca.trim()) {
            return this.usuariosAtivos;
        }
        return this.usuariosAtivos.filter(u =>
            u.nome.toLowerCase().includes(this.termoBusca.toLowerCase())
        );
    }

    abrirModalParaCriar(): void {
        this.isEditMode = false;
        this.usuarioEmEdicao = {id_perfil: this.perfis.find(p => p.nome === 'Operador')?.id_perfil || 2};
        this.showUserModal = true;
    }

    abrirModalParaEditar(usuario: Usuario): void {
        this.isEditMode = true;
        this.usuarioEmEdicao = {
            id: usuario.id_usuario,
            nome: usuario.nome,
            email: usuario.email,
            id_perfil: usuario.id_perfil
        };
        this.showUserModal = true;
    }

    fecharModalUsuario(): void {
        this.showUserModal = false;
    }

    salvarUsuario(): void {
        if (this.isEditMode && this.usuarioEmEdicao.id) {
            this.userService.atualizarUsuario(this.usuarioEmEdicao.id, this.usuarioEmEdicao).subscribe(() => {
                this.carregarDados();
                this.fecharModalUsuario();
            });
        } else {
            if (!this.usuarioEmEdicao.nome || !this.usuarioEmEdicao.email || !this.usuarioEmEdicao.id_perfil) {
                alert('Nome, e-mail e perfil são obrigatórios.');
                return;
            }
            const payload: UsuarioPayload = {
                nome: this.usuarioEmEdicao.nome,
                email: this.usuarioEmEdicao.email,
                id_perfil: this.usuarioEmEdicao.id_perfil
            };
            this.userService.criarUsuarioAtivo(payload).subscribe({
                next: (res) => {
                    alert(res.mensagem || 'Usuário criado com sucesso!');
                    this.carregarDados();
                    this.fecharModalUsuario();
                },
                error: (err) => alert(`Erro ao criar Usuário: ${err.error?.message || 'Tente novamente.'}`)
            });
        }
    }

    desativarUsuario(id: number): void {
        if (confirm('Tem a certeza que deseja desativar este Usuário?')) {
            this.userService.desativarUsuario(id).subscribe(() => this.carregarDados());
        }
    }

    abrirModalPendentes(): void {
        this.showPendingModal = true;
    }

    fecharModalPendentes(): void {
        this.showPendingModal = false;
    }

    aprovarUsuarioPendente(id_usuario: number): void {
        this.userService.aprovarPendente(id_usuario).subscribe(() => {
            this.carregarDados();
        });
    }

    rejeitarUsuarioPendente(id_usuario: number): void {
        if (confirm('Tem a certeza que deseja rejeitar esta solicitação?')) {
            this.userService.rejeitarPendente(id_usuario).subscribe(() => {
                this.carregarDados();
            });
        }
    }

    toggleActionSelect(index: number): void {
        this.openActionIndex = this.openActionIndex === index ? null : index;
    }
}
