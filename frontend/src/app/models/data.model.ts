export interface Data {
    id?: number;
    nome: string;
    conteudo: string;
    palavrasChave: string[];
    valorSemantico?: number;
    tema?: string;
    microtema?: string;
    ativo?: boolean;
    arquivos?: Arquivo[];
}

export interface Arquivo {
    nome: string;
    tipo: string;
    conteudoBase64: string;
}