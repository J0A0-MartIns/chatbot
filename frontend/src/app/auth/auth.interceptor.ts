import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from './auth.service';

/**
 * Intercepta todas as requisições HTTP e adiciona o token JWT de autenticação
 * no cabeçalho 'Authorization', se um token existir.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);
    const authToken = authService.getToken();

    if (authToken) {
        // Clona a requisição para adicionar o novo cabeçalho.
        const authReq = req.clone({
            setHeaders: {
                Authorization: `Bearer ${authToken}`
            }
        });
        // --- CORREÇÃO ---
        // Envia a requisição CLONADA (authReq) com o token, não a original (req).
        return next(authReq);
    }

    // Se não houver token, passa a requisição original adiante.
    return next(req);
};
