import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { PerfilService } from '../../services/perfil.service';
import { Usuario, UsuarioPayload } from '../../models/usuario.model';
import { Perfil } from '../../models/perfil.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

/**
 * @Component UsuarioComponent
 * @description
 * Gerencia a interface para criar, visualizar, editar, aprovar e
 * rejeitar utilizadores ativos e pendentes.
 */
@Component({
    selector: 'app-usuario',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './usuario.component.html',
    styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit {
    // --- Listas de Dados ---
    usuariosAtivos: Usuario[] = [];
    usuariosPendentes: Usuario[] = [];
    perfis: Perfil[] = [];

    // --- Controlo da UI ---
    termoBusca = '';
    showUserModal = false;
    showPendingModal = false;
    isEditMode = false;
    openActionIndex: number | null = null;

    /** Guarda os dados do formulário do modal para criar ou editar um utilizador. */
    usuarioEmEdicao: Partial<UsuarioPayload> & { id?: number } = {};

    constructor(
        private userService: UserService,
        private perfilService: PerfilService
    ) {}

    /**
     * Hook inicial que carrega os dados necessários para a página.
     */
    ngOnInit(): void {
        this.carregarDados();
    }

    /**
     * Busca os dados dos utilizadores (ativos e pendentes) e dos perfis na API.
     */
    carregarDados(): void {
        this.userService.getUsuarios().subscribe(data => this.usuariosAtivos = data);
        this.userService.getUsuariosPendentes().subscribe(data => this.usuariosPendentes = data);
        this.perfilService.getPerfis().subscribe(data => this.perfis = data);
    }

    /**
     * Retorna a lista de utilizadores ativos filtrada pelo `termoBusca`.
     */
    usuariosFiltrados(): Usuario[] {
        if (!this.termoBusca.trim()) {
            return this.usuariosAtivos;
        }
        return this.usuariosAtivos.filter(u =>
            u.nome.toLowerCase().includes(this.termoBusca.toLowerCase())
        );
    }

    /**
     * Abre o modal no modo de criação de um novo utilizador.
     */
    abrirModalParaCriar(): void {
        this.isEditMode = false;
        this.usuarioEmEdicao = { id_perfil: this.perfis.find(p => p.nome === 'Operador')?.id_perfil || 2 };
        this.showUserModal = true;
    }

    /**
     * Abre o modal no modo de edição, preenchendo com os dados do utilizador selecionado.
     */
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

    /**
     * Fecha o modal de criação/edição.
     */
    fecharModalUsuario(): void {
        this.showUserModal = false;
    }

    /**
     * Salva um novo utilizador ou atualiza um existente com base no modo do modal.
     */
    salvarUsuario(): void {
        if (this.isEditMode && this.usuarioEmEdicao.id) {
            // Lógica de Atualização
            this.userService.atualizarUsuario(this.usuarioEmEdicao.id, this.usuarioEmEdicao).subscribe(() => {
                this.carregarDados();
                this.fecharModalUsuario();
            });
        } else {
            // Lógica de Criação
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
                    alert(res.mensagem || 'Utilizador criado com sucesso!');
                    this.carregarDados();
                    this.fecharModalUsuario();
                },
                error: (err) => alert(`Erro ao criar utilizador: ${err.error?.message || 'Tente novamente.'}`)
            });
        }
    }

    /**
     * Desativa a conta de um utilizador ativo, mudando o seu status.
     */
    desativarUsuario(id: number): void {
        if (confirm('Tem a certeza que deseja desativar este utilizador?')) {
            this.userService.desativarUsuario(id).subscribe(() => this.carregarDados());
        }
    }


    /**
     * Abre o modal que exibe as solicitações de cadastro pendentes.
     */
    abrirModalPendentes(): void {
        this.showPendingModal = true;
    }

    /**
     * Fecha o modal de solicitações pendentes.
     */
    fecharModalPendentes(): void {
        this.showPendingModal = false;
    }

    /**
     * Aprova uma solicitação de cadastro, mudando o status do utilizador para 'ativo'.
     */
    aprovarUsuarioPendente(id_usuario: number): void {
        this.userService.aprovarPendente(id_usuario).subscribe(() => {
            this.carregarDados();
        });
    }

    /**
     * Rejeita (exclui) uma solicitação de cadastro.
     */
    rejeitarUsuarioPendente(id_usuario: number): void {
        if (confirm('Tem a certeza que deseja rejeitar esta solicitação?')) {
            this.userService.rejeitarPendente(id_usuario).subscribe(() => {
                this.carregarDados();
            });
        }
    }

    /**
     * Controla a visibilidade do menu de ações (dropdown) de cada linha da tabela.
     */
    toggleActionSelect(index: number): void {
        this.openActionIndex = this.openActionIndex === index ? null : index;
    }
}
