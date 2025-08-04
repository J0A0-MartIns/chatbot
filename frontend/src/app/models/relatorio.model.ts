export interface RelatorioInteracao {
    data_atendimento: string;
    pergunta_usuario: string;
    resposta_gerada: string;
    usuario: string;
    avaliacao: boolean | null;
    tema: string;
    sub_tema: string;
    documento?: string;
}

export interface RelatorioUsoSubtema {
    id_subtema: number;
    nome: string;
    count: string;
}

export interface Paginacao<T> {
    count: number;
    rows: T[];
}