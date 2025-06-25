import { Perfil } from './perfil.model';

// Interface para um objeto de utilizador, como vem da API.
// Serve tanto para utilizadores ativos (ativo: true) quanto pendentes (ativo: false).
export interface Usuario {
  id_usuario: number; // A chave primária é sempre id_usuario
  nome: string;
  email: string;
  ativo: boolean;
  id_perfil: number;
  Perfil?: Perfil;
}

// Interface para o PAYLOAD de criação/atualização
export interface UsuarioPayload {
  nome: string;
  email: string;
  senha?: string;
  id_perfil: number;
}

// Interface para a resposta da API ao criar um utilizador ativo
export interface CriarUsuarioResponse {
  usuario: Usuario;
  mensagem: string;
}

// Interface para o payload de troca de senha
export interface TrocarSenhaPayload {
  senhaAtual: string;
  novaSenha: string;
}
