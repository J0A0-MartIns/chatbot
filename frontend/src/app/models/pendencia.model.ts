// Interface que representa o objeto de pendência que a API retorna
export interface Pendencia {
    id_pendencia: number;
    pergunta: string;      // A pergunta original do usuário
    resposta: string;      // A resposta que o bot deu (e que foi mal avaliada)
    usuario: string;       // O nome do usuário que fez a pergunta
    motivo: string | null; // O motivo pelo qual virou pendência (pode ser o comentário do feedback)
    data_criacao: string;
}

// Interface para o payload que enviamos ao aprovar uma pendência
export interface AprovacaoPayload {
    titulo: string;
    conteudo: string;
    palavras_chave: string;
    id_subtema: number;
    // O usuario_id será pego do token do admin no back-end
}
