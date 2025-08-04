import {Documento} from "./documento.model";

export interface PerguntaPayload {
    pergunta: string;
    id_subtema: number;
}

export interface RespostaChat {
    id_atendimento: number;
    solucoes: Documento[];
    encontrado: boolean;
    resposta: string;
}

export interface FeedbackPayload {
    id_atendimento: number;
    avaliacao: boolean;
    comentario?: string;
    tema?: string | null;
    subtema?: string | null;
}