export interface Pendencia {
    id_pendencia: number;
    pergunta: string;
    resposta: string;
    usuario: string;
    motivo: string | null;
    data_criacao: string;
    sugestao_tema: string | null;
    sugestao_subtema: string | null;
}

export interface AprovacaoPayload {
    titulo: string;
    conteudo: string;
    palavras_chave: string;
    id_subtema: number;
    sugestao_tema?: string | null;
    sugestao_subtema?: string | null;
}
