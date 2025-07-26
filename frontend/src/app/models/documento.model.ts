import {Tema} from "./tema.model";
import { Subtema } from "./subtema.model";

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
    DocumentoArquivos?: DocumentoArquivo[];
}

export interface DocumentoArquivo {
    id_arquivo: number;
    nome_original: string;
    caminho_arquivo: string;
}
