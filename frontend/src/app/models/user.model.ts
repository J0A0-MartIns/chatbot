import { Perfil } from './perfil.model';

// --- Interface para um usuário ATIVO ---
export interface Usuario {
  id_usuario: number;
  nome: string;
  email: string;
  ativo: boolean;
  id_perfil: number;
  Perfil?: Perfil; // O objeto Perfil aninhado
}

// --- Interface para um usuário PENDENTE (AGORA EXPORTADA) ---
export interface UsuarioPendente {
  id_usuario_pendente: number; // O nome da PK na tabela de pendentes
  nome: string;
  email: string;
  id_perfil: number;
  Perfil?: Perfil; // A API também pode retornar o perfil associado
}

// --- Interface para o PAYLOAD de criação/atualização ---
export interface UsuarioPayload {
  nome: string;
  email: string;
  senha?: string;
  id_perfil: number;
}
