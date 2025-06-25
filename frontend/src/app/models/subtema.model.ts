import { Tema } from './tema.model';

// Define a estrutura de um objeto Subtema, como vem da API
export interface Subtema {
    id_subtema: number;
    nome: string;
    id_tema: number;
    Tema?: Tema; // Opcional, se a API incluir o objeto Tema completo
}
