// Define as estruturas aninhadas que vêm do back-end
export interface Subtema {
    id_subtema: number;
    nome: string;
}

export interface UsuarioSimple {
    id_usuario: number;
    nome: string;
}

// A interface principal que corresponde exatamente à API
export interface Documento {
    id_documento?: number;
    titulo: string; // ANTES: 'nome'
    conteudo: string;
    palavras_chave: string; // ANTES: 'palavrasChave: string[]' - agora é uma string única
    ativo: boolean;
    data_criacao?: string;

    // No back-end, estas são as chaves estrangeiras que você envia
    usuario_id?: number;
    id_subtema?: number;

    // Estes são os objetos completos que você recebe da API
    Subtema?: Subtema;
    Usuario?: UsuarioSimple;
    // A propriedade 'arquivos' não existe diretamente no modelo principal
}
