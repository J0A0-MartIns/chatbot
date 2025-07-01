export interface Pendencia {
    id_pendencia: number;
    pergunta: string;
    resposta: string;
    usuario: string;
    motivo: string | null;
    data_criacao: string;
}

export interface AprovacaoPayload {
    titulo: string;
    conteudo: string;
    palavras_chave: string;
    id_subtema: number;
}
