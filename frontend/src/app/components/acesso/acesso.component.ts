import { Component, OnInit } from '@angular/core';
import { PerfilService } from '../../services/perfil.service';
import { Perfil } from '../../models/perfil.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {Permissao} from "../../models/permissao.model";

interface GrupoDePagina {
  nomeExibicao: string;
  permissoesChave: string[];
  permissoes: Permissao[];
  selecionado: boolean;
}

@Component({
  selector: 'app-acesso',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './acesso.component.html',
  styleUrls: ['./acesso.component.css']
})
export class AcessoComponent implements OnInit {
  perfis: Perfil[] = [];
  gruposDePaginas: GrupoDePagina[] = [];
  permissoesSelecionadas = new Map<number, boolean>();

  modalAberto = false;
  isEditMode = false;
  perfilEmEdicao: Partial<Perfil> = {};
  openActionIndex: number | null = null;

  constructor(private perfilService: PerfilService) {}

  ngOnInit(): void {
    this.carregarPerfis();
    this.carregarEAgruparPermissoes();
  }

  carregarPerfis(): void {
    this.perfilService.getPerfis().subscribe(data => this.perfis = data);
  }

  carregarEAgruparPermissoes(): void {
    this.perfilService.getTodasPermissoes().subscribe(todas => {
      this.gruposDePaginas = [
        { nomeExibicao: 'Gestão de Utilizadores', permissoesChave: ['usuario', 'perfil', 'permissoes'], permissoes: [], selecionado: false },
        { nomeExibicao: 'Gestão de Conteúdo (Base e Categorias)', permissoesChave: ['documento', 'categoria'], permissoes: [], selecionado: false },
        { nomeExibicao: 'Acesso a Dashboards e Relatórios', permissoesChave: ['dashboard', 'relatorio', 'pendencia'], permissoes: [], selecionado: false },
      ];

      todas.forEach(p => {
        const grupo = this.gruposDePaginas.find(g => g.permissoesChave.some(chave => p.nome.includes(chave)));
        if (grupo) {
          grupo.permissoes.push(p);
        }
      });
      this.gruposDePaginas = this.gruposDePaginas.filter(g => g.permissoes.length > 0);
    });
  }

  abrirModalParaCriar(): void {
    this.isEditMode = false;
    this.perfilEmEdicao = { nome: '' };
    this.permissoesSelecionadas.clear();
    this.atualizarCheckboxDosGrupos();
    this.modalAberto = true;
  }

  abrirModalParaEditar(perfil: Perfil): void {
    this.isEditMode = true;
    this.perfilEmEdicao = { ...perfil };
    this.permissoesSelecionadas.clear();
    perfil.Permissoes.forEach(p => this.permissoesSelecionadas.set(p.id_permissao, true));
    this.atualizarCheckboxDosGrupos(); // Atualiza os checkboxes principais
    this.modalAberto = true;
  }

  toggleGrupoCompleto(grupo: GrupoDePagina, event: any): void {
    const isChecked = event.target.checked;
    grupo.selecionado = isChecked;
    grupo.permissoes.forEach(p => {
      this.permissoesSelecionadas.set(p.id_permissao, isChecked);
    });
  }

  atualizarCheckboxDosGrupos(): void {
    this.gruposDePaginas.forEach(grupo => {
      grupo.selecionado = grupo.permissoes.length > 0 && grupo.permissoes.every(p => this.permissoesSelecionadas.get(p.id_permissao));
    });
  }

  salvarPerfil(): void {
    const nome = this.perfilEmEdicao.nome;
    const permissoesIds = Array.from(this.permissoesSelecionadas.entries())
        .filter(([, isSelected]) => isSelected)
        .map(([id]) => id);

    if (!nome) { alert('O nome do perfil é obrigatório.'); return; }

    const acao = this.isEditMode
        ? this.perfilService.atualizarPerfil(this.perfilEmEdicao.id_perfil!, nome, permissoesIds)
        : this.perfilService.criarPerfil(nome, permissoesIds);

    acao.subscribe(() => { this.carregarPerfis(); this.fecharModal(); });
  }

  fecharModal = () => this.modalAberto = false;
  excluirPerfil = (id: number | undefined) => { if (id && confirm('Tem certeza que deseja prosseguir?')) this.perfilService.excluirPerfil(id).subscribe(() => this.carregarPerfis()); };
  toggleActionSelect = (index: number) => this.openActionIndex = this.openActionIndex === index ? null : index;
}