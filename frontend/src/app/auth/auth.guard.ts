import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

/**
 * Um guardião que protege as rotas, permitindo o acesso apenas a usuários autenticados.
 */
export const authGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    // Usa o método isLoggedIn() do nosso serviço de autenticação
    if (authService.isLoggedIn()) {
        return true; // Usuário está logado, permite o acesso.
    }

    // Usuário não está logado, redireciona para a página de login.
    router.navigate(['/login']);
    return false;
};
