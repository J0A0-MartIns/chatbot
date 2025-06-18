import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { PerfilAcessoService } from '../../services/perfil.service';
import { PerfilAcesso } from '../../models/perfil.model';

@Component({
    selector: 'app-usuarios',
    standalone: true,
    imports: [FormsModule, NgIf, NgFor],
    styleUrls: ['./usuario.component.css'],
    templateUrl: './usuario.component.html',
})
export class UsuarioComponent implements OnInit {
    users: User[] = [];
    newUser: User = { name: '', email: '', password: '', role: 'Operador' };
    editIndex: number | null = null;
    successMessage: string | null = null;
    perfis: PerfilAcesso[] = [];
    showModal = false;
    openActionIndex: number | null = null;
    pendingUsers: User[] = [];
    showPendingModal = false;
    editingPendingIndex: number | null = null;
    filtroNome: string = '';
    termoBuscaTemp: string = '';

    constructor(private userService: UserService, private servicoPerfil: PerfilAcessoService) {}

    ngOnInit() {
        this.users = this.userService.getUsers();
        this.perfis = this.servicoPerfil.obterPerfis();
    }

    private generatePassword(length: number = 8): string {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$!';
        let newPass = '';
        for (let i = 0; i < length; i++) {
            newPass += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return newPass;
    }

    openModal() {
        this.editIndex = null;
        this.newUser = { name: '', email: '', password: '', role: this.perfis.length > 0 ? this.perfis[0].nome : 'Operador' };
        this.successMessage = null;
        this.showModal = true;
    }

    closeModal() {
        this.showModal = false;
        this.successMessage = null;
        this.cancelEdit();
    }

    openPendingModal() {
        this.pendingUsers = JSON.parse(localStorage.getItem('pendingUsers') || '[]');
        this.showPendingModal = true;
    }

    closePendingModal() {
        this.showPendingModal = false;
        this.editingPendingIndex = null;
    }

    approvePendingUser(index: number) {
        const userToApprove = this.pendingUsers[index];

        if (this.users.some(u => u.email === userToApprove.email)) {
            alert('E-mail já está cadastrado!');
            return;
        }

        this.userService.addUser(userToApprove);
        this.users = this.userService.getUsers();

        this.pendingUsers.splice(index, 1);
        localStorage.setItem('pendingUsers', JSON.stringify(this.pendingUsers));
    }

    rejectPendingUser(index: number) {
        if (confirm('Deseja rejeitar esta solicitação?')) {
            this.pendingUsers.splice(index, 1);
            localStorage.setItem('pendingUsers', JSON.stringify(this.pendingUsers));
        }
    }

    editPendingUser(index: number) {
        const user = this.pendingUsers[index];
        this.newUser = { ...user };
        this.editingPendingIndex = index;
        this.showPendingModal = false;
        this.showModal = true;
    }

    usersFiltrados(): User[] {
        const termo = this.filtroNome.trim().toLowerCase();
        if (!termo) return this.users;

        return this.users.filter(user =>
            user.name.toLowerCase().includes(termo)
        );
    }

    aplicarFiltro() {
        this.filtroNome = this.termoBuscaTemp;
    }

    addOrUpdateUser() {
        if (this.editIndex === null) {
            this.newUser.password = this.generatePassword();
            this.userService.addUser(this.newUser);
            this.successMessage = 'Usuário adicionado!';
        } else {
            const currentUsers = this.userService.getUsers();
            const oldPassword = currentUsers[this.editIndex].password;
            this.newUser.password = oldPassword;
            this.userService.updateUser(this.editIndex, this.newUser);
            this.successMessage = 'Usuário atualizado!';
        }

        this.users = this.userService.getUsers();
        setTimeout(() => {
            this.closeModal();
        }, 1500);

        if (this.editingPendingIndex !== null) {
            this.pendingUsers.splice(this.editingPendingIndex, 1);
            localStorage.setItem('pendingUsers', JSON.stringify(this.pendingUsers));
            this.editingPendingIndex = null;
        }
    }

    editUser(index: number) {
        this.editIndex = index;
        this.newUser = { ...this.users[index] };
        this.successMessage = null;
        this.showModal = true;
    }

    deleteUser(index: number) {
        if (confirm('Tem certeza que deseja excluir este usuário?')) {
            this.userService.deleteUser(index);
            this.users = this.userService.getUsers();
        }
    }

    cancelEdit() {
        this.newUser = { name: '', email: '', password: '', role: 'Operador' };
        this.editIndex = null;
    }

    toggleActionSelect(index: number) {
        if (this.openActionIndex === index) {
            this.openActionIndex = null;
        } else {
            this.openActionIndex = index;
        }
    }
}
