import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http'; // Importa o provideHttpClient
import { routes } from './app.routes';
import { authInterceptor } from './auth/auth.interceptor'; // Importa nosso interceptor

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    // --- ADIÇÃO IMPORTANTE ---
    // Registra o HttpClient e diz a ele para usar nosso interceptor em todas as chamadas.
    provideHttpClient(withInterceptors([authInterceptor]))
  ]
};
