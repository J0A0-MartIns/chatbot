// CORREÇÃO: Importa a interface Permissao do seu próprio ficheiro de modelo.
import { Permissao } from './permissao.model';

/**
 * Define a estrutura de um objeto de Perfil, como vem da API.
 */
export interface Perfil {
    id_perfil: number;
    nome: string;
    Permissoes: Permissao[];
}
