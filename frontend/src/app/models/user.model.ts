import {Permissoes} from "./permissoes.model";

export interface User {
  name: string;
  email: string;
  password: string;
  role: string;
  permissoes?: Permissoes;
}
