import { Injectable } from '@angular/core';
import { User } from '../models/user.model';

@Injectable({
    providedIn: 'root',
})
export class UserService {
    private storageKey = 'usuarios';

    getUsers(): User[] {
        const data = localStorage.getItem(this.storageKey);
        return data ? JSON.parse(data) : [];
    }

    saveUsers(users: User[]) {
        localStorage.setItem(this.storageKey, JSON.stringify(users));
    }

    addUser(user: User) {
        const users = this.getUsers();
        users.push(user);
        this.saveUsers(users);
    }

    updateUser(index: number, updatedUser: User) {
        const users = this.getUsers();
        users[index] = updatedUser;
        this.saveUsers(users);
    }

    deleteUser(index: number) {
        const users = this.getUsers();
        users.splice(index, 1);
        this.saveUsers(users);
    }
}
