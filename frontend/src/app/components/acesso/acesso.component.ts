import { Component, OnInit } from '@angular/core';
import { AcessoService } from '../../services/acesso.service';

interface PerfilComPermissoes {
  id_perfil?: number;
  nome: string;
  permissoes: {
    acessaGerirUsuarios: boolean;
    acessaDashboard: boolean;
    acessaBase: boolean;
    acessaChat: boolean;
  };
}

@Component({
  selector: 'app-acesso',
  templateUrl: './acesso.component.html'
})
export class AcessoComponent implements OnInit {
  perfis: PerfilComPermissoes[] = [];
  novoPerfil: PerfilComPermissoes = this.criarPerfilVazio();
  modalAberto = false;
  editIndex: number | null = null;
  openActionIndex: number | null = null;

  constructor(private acessoService: AcessoService) {}

  ngOnInit(): void {
    this.carregarPerfis();
  }

  criarPerfilVazio(): PerfilComPermissoes {
    return {
      nome: '',
      permissoes: {
        acessaGerirUsuarios: false,
        acessaDashboard: false,
        acessaBase: false,
        acessaChat: false
      }
    };
  }

  carregarPerfis(): void {
    this.acessoService.getPerfisComPermissoes().subscribe((res) => {
      this.perfis = res.map((perfil: any) => ({
        id_perfil: perfil.id_perfil,
        nome: perfil.nome,
        permissoes: {
          acessaGerirUsuarios: perfil.permissoes.includes('acessaGerirUsuarios'),
          acessaDashboard: perfil.permissoes.includes('acessaDashboard'),
          acessaBase: perfil.permissoes.includes('acessaBase'),
          acessaChat: perfil.permissoes.includes('acessaChat')
        }
      }));
    });
  }

  abrirModal(): void {
    this.novoPerfil = this.criarPerfilVazio();
    this.editIndex = null;
    this.modalAberto = true;
  }

  fecharModal(): void {
    this.modalAberto = false;
  }

  toggleActionSelect(index: number): void {
    this.openActionIndex = this.openActionIndex === index ? null : index;
  }

  editarPerfil(index: number): void {
    this.novoPerfil = JSON.parse(JSON.stringify(this.perfis[index]));
    this.editIndex = index;
    this.modalAberto = true;
  }

  excluirPerfil(index: number): void {
    const id = this.perfis[index].id_perfil!;
    this.acessoService.excluirPerfil(id).subscribe(() => {
      this.perfis.splice(index, 1);
    });
  }

  salvarPerfil(): void {
    const permissoesSelecionadas = Object.keys(this.novoPerfil.permissoes).filter(
        (chave) => this.novoPerfil.permissoes[chave as keyof typeof this.novoPerfil.permissoes]
    );

    const payload = {
      nome: this.novoPerfil.nome,
      permissoes: permissoesSelecionadas
    };

    if (this.editIndex !== null && this.novoPerfil.id_perfil) {
      const id = this.novoPerfil.id_perfil;
      this.acessoService.atualizarPerfil(id, payload).subscribe(() => {
        this.carregarPerfis();
        this.fecharModal();
      });
    } else {
      this.acessoService.criarPerfil(payload).subscribe(() => {
        this.carregarPerfis();
        this.fecharModal();
      });
    }
  }
}
