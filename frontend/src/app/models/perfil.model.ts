// Interface para um objeto de Permissão, como vem da API
export interface Permissao {
    id_permissao: number;
    nome: string; // Ex: 'criar_documento'
}

// Interface para um objeto de Perfil, incluindo suas permissões associadas
export interface Perfil {
    id_perfil: number;
    nome: string; // Ex: 'Admin'
    Permissaos: Permissao[]; // O Sequelize usa o nome do modelo no plural por padrão
}
