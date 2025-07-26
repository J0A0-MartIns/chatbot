import { Tema } from './tema.model';

export interface Subtema {
    id_subtema: number;
    nome: string;
    id_tema: number;
    tema?: Tema;
}
