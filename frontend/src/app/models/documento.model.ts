import {Tema} from "./tema.model";

export interface Subtema {
    id_subtema: number;
    nome: string;
    id_tema: number;
}

export interface UsuarioSimple {
    id_usuario: number;
    nome: string;
}

export interface Documento {
    id_documento?: number;
    titulo: string;
    conteudo: string;
    palavras_chave: string;
    ativo: boolean;
    data_criacao?: string;
    id_usuario?: number;
    id_subtema?: number;

    Tema?: Tema;
    Subtema?: Subtema;
    Usuario?: UsuarioSimple;
}
