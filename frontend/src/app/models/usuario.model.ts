import { Perfil } from './perfil.model';

export interface Usuario {
  id_usuario: number;
  nome: string;
  email: string;
  status: 'ativo' | 'pendente' | 'inativo';
  id_perfil: number;
  Perfil?: Perfil;
}

export interface UsuarioPayload {
  nome: string;
  email: string;
  senha?: string;
  id_perfil: number;
}

export interface CriarUsuarioResponse {
  usuario: Usuario;
  mensagem: string;
}

export interface TrocarSenhaPayload {
  senhaAtual: string;
  novaSenha: string;
}