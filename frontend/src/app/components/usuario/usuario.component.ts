import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { PerfilService } from '../../services/perfil.service';
import { Usuario, UsuarioPendente, UsuarioPayload } from '../../models/user.model';
import { Perfil } from '../../models/perfil.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-usuario',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './usuario.component.html',
    styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit {
    usuariosAtivos: Usuario[] = [];
    usuariosPendentes: UsuarioPendente[] = [];
    perfis: Perfil[] = [];

    termoBusca = '';
    showUserModal = false;
    showPendingModal = false;
    isEditMode = false;
    openActionIndex: number | null = null;

    usuarioEmEdicao: Partial<UsuarioPayload> & { id?: number } = {};

    constructor(
        private userService: UserService,
        private perfilService: PerfilService
    ) {}

    ngOnInit(): void {
        this.carregarDados();
    }

    carregarDados(): void {
        this.userService.getUsuarios().subscribe(data => this.usuariosAtivos = data);
        this.userService.getUsuariosPendentes().subscribe(data => this.usuariosPendentes = data);
        this.perfilService.getPerfis().subscribe(data => this.perfis = data);
    }

    usuariosFiltrados(): Usuario[] {
        if (!this.termoBusca) return this.usuariosAtivos;
        return this.usuariosAtivos.filter(u =>
            u.nome.toLowerCase().includes(this.termoBusca.toLowerCase())
        );
    }

    abrirModalParaCriar(): void {
        this.isEditMode = false;
        this.usuarioEmEdicao = { id_perfil: this.perfis.find(p => p.nome === 'Operador')?.id_perfil || 2 };
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

    salvarUsuario(): void {
        if (this.isEditMode && this.usuarioEmEdicao.id) {
            this.userService.atualizarUsuario(this.usuarioEmEdicao.id, this.usuarioEmEdicao).subscribe(() => {
                this.carregarDados();
                this.fecharModalUsuario();
            });
        } else {
            const payload = { ...this.usuarioEmEdicao, senha: 'Mudar@123' } as UsuarioPayload;
            this.userService.criarUsuarioAtivo(payload).subscribe(() => {
                this.carregarDados();
                this.fecharModalUsuario();
            });
        }
    }

    desativarUsuario(id: number): void {
        if (confirm('Tem certeza que deseja desativar este usuário?')) {
            this.userService.desativarUsuario(id).subscribe(() => this.carregarDados());
        }
    }

    aprovarUsuarioPendente(id: number): void {
        this.userService.aprovarPendente(id).subscribe(() => this.carregarDados());
    }

    rejeitarUsuarioPendente(id: number): void {
        this.userService.rejeitarPendente(id).subscribe(() => this.carregarDados());
    }

    fecharModalUsuario(): void { this.showUserModal = false; }
    abrirModalPendentes(): void { this.showPendingModal = true; }
    fecharModalPendentes(): void { this.showPendingModal = false; }

    /**
     * CORREÇÃO: Função adicionada para controlar o menu dropdown de ações.
     */
    toggleActionSelect(index: number): void {
        this.openActionIndex = this.openActionIndex === index ? null : index;
    }
}
