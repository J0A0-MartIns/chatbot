import { inject } from '@angular/core';
import {HttpErrorResponse, HttpInterceptorFn} from '@angular/common/http';
import { AuthService } from './auth.service';
import {catchError, throwError} from "rxjs";

/**
 * Intercepta todas as requisições e adiciona o token JWT de autenticação
 * no cabeçalho 'Authorization', se um token existir.
 * att. captura erros 401/403 para forçar logout e mostrar modal de sessão expirada
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);
    const authToken = authService.getToken();

    let authReq = req;
    if (authToken) {
        authReq = req.clone({
            setHeaders: {
                Authorization: `Bearer ${authToken}`
            }
        });
    }

    return next(authReq).pipe(
        catchError((error: HttpErrorResponse) => {
            if (error.status === 401 || error.status === 403) {
                const errorMessage = error.error?.message || 'A sua sessão é inválida ou expirou. Por favor, faça login novamente.';
                authService.handleSessionExpiration(errorMessage);            }
            return throwError(() => error);
        })
    );
};
