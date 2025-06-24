import { Component, OnInit } from '@angular/core';
import { UserService, Usuario } from '../../services/user.service';

interface UsuarioView {
    id_usuario?: number;
    name: string;
    email: string;
    role: string;
}

@Component({
    selector: 'app-usuario',
    templateUrl: './usuario.component.html'
})
export class UsuarioComponent implements OnInit {
    users: UsuarioView[] = [];
    pendingUsers: UsuarioView[] = [];
    perfis: { id_perfil: number; nome: string }[] = [];

    newUser: UsuarioView = { name: '', email: '', role: 'Operador' };
    termoBuscaTemp = '';
    showModal = false;
    showPendingModal = false;
    editIndex: number | null = null;
    openActionIndex: number | null = null;
    successMessage = '';

    constructor(private userService: UserService) {}

    ngOnInit(): void {
        this.carregarUsuarios();
        this.carregarPendentes();
        this.carregarPerfis();
    }

    carregarUsuarios(): void {
        this.userService.getUsuarios().subscribe(users => {
            this.users = users.map(u => ({
                id_usuario: u.id_usuario,
                name: u.nome,
                email: u.email,
                role: this.getRoleName(u.id_perfil)
            }));
        });
    }

    carregarPendentes(): void {
        this.userService.getPendentes().subscribe(pendentes => {
            this.pendingUsers = pendentes.map(p => ({
                id_usuario: p.id_usuario,
                name: p.nome,
                email: p.email,
                role: this.getRoleName(p.id_perfil)
            }));
        });
    }

    carregarPerfis(): void {
        this.perfis = [
            { id_perfil: 1, nome: 'Administrador' },
            { id_perfil: 2, nome: 'Operador' }
        ];
    }

    getRoleName(id_perfil: number): string {
        const perfil = this.perfis.find(p => p.id_perfil === id_perfil);
        return perfil ? perfil.nome : 'Operador';
    }

    getPerfilId(nome: string): number {
        const perfil = this.perfis.find(p => p.nome === nome);
        return perfil ? perfil.id_perfil : 2;
    }

    usersFiltrados(): UsuarioView[] {
        const termo = this.termoBuscaTemp.toLowerCase();
        return this.users.filter(u =>
            u.name.toLowerCase().includes(termo) || u.email.toLowerCase().includes(termo)
        );
    }

    openModal(): void {
        this.newUser = { name: '', email: '', role: 'Operador' };
        this.editIndex = null;
        this.showModal = true;
        this.successMessage = '';
    }

    closeModal(): void {
        this.showModal = false;
        this.successMessage = '';
    }

    openPendingModal(): void {
        this.showPendingModal = true;
    }

    closePendingModal(): void {
        this.showPendingModal = false;
    }

    addOrUpdateUser(): void {
        const payload: Usuario = {
            nome: this.newUser.name,
            email: this.newUser.email,
            senha: '123456',
            id_perfil: this.getPerfilId(this.newUser.role)
        };

        if (this.editIndex !== null) {
            const id = this.users[this.editIndex].id_usuario!;
            this.userService.atualizar(id, payload).subscribe(() => {
                this.successMessage = 'Usuário atualizado com sucesso!';
                this.carregarUsuarios();
                this.closeModal();
            });
        } else {
            this.userService.registrar(payload).subscribe(() => {
                this.successMessage = 'Usuário adicionado com sucesso!';
                this.carregarUsuarios();
                this.closeModal();
            });
        }
    }

    editUser(index: number): void {
        const user = this.users[index];
        this.editIndex = index;
        this.newUser = { ...user };
        this.showModal = true;
    }

    deleteUser(index: number): void {
        const id = this.users[index].id_usuario!;
        this.userService.excluir(id).subscribe(() => {
            this.carregarUsuarios();
        });
    }

    toggleActionSelect(index: number): void {
        this.openActionIndex = this.openActionIndex === index ? null : index;
    }

    approvePendingUser(index: number): void {
        const id = this.pendingUsers[index].id_usuario!;
        this.userService.aprovar(id).subscribe(() => {
            this.pendingUsers.splice(index, 1);
            this.carregarUsuarios();
        });
    }

    rejectPendingUser(index: number): void {
        const id = this.pendingUsers[index].id_usuario!;
        this.userService.rejeitar(id).subscribe(() => {
            this.pendingUsers.splice(index, 1);
        });
    }

    editPendingUser(index: number): void {
        const pending = this.pendingUsers[index];
        this.editIndex = null;
        this.newUser = {
            name: pending.name,
            email: pending.email,
            role: pending.role
        };
        this.showPendingModal = false;
        this.showModal = true;
    }
}
