// Interface para um objeto de Permissão
export interface Permissao {
    id_permissao: number;
    nome: string;
}

// Interface para um objeto de Perfil
export interface Perfil {
    id_perfil: number;
    nome: string;
    Permissoes: Permissao[];
}
