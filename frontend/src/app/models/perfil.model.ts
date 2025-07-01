import { Permissao } from './permissao.model';

export interface Perfil {
    id_perfil: number;
    nome: string;
    Permissoes: Permissao[];
}
