export interface ChatMessage {
    tema: string;
    microTema: string;
    pergunta: string;
    resposta?: string;
    dataHora?: string;
    palavraChave?: string[];
    avaliacao?: 'util' | 'nao-util';
}