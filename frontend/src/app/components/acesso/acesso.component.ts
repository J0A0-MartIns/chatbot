import { Component, OnInit } from '@angular/core';
import { PerfilService } from '../../services/perfil.service';
import { Perfil } from '../../models/perfil.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {Permissao} from "../../models/permissao.model";

// Interface para definir a estrutura dos nossos grupos de páginas
interface GrupoDePagina {
  nomeExibicao: string; // Ex: "Gestão de Conteúdo"
  permissoesChave: string[];
  permissoes: Permissao[];
  selecionado: boolean; // Controla o checkbox principal do grupo
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
      // Define os grupos de páginas que você quer exibir no modal
      this.gruposDePaginas = [
        { nomeExibicao: 'Gestão de Utilizadores', permissoesChave: ['usuario', 'perfi', 'permis'], permissoes: [], selecionado: false },
        { nomeExibicao: 'Gestão de Conteúdo (Base e Categorias)', permissoesChave: ['documento', 'categoria'], permissoes: [], selecionado: false },
        { nomeExibicao: 'Acesso a Dashboards e Relatórios', permissoesChave: ['dashboard', 'relatorio', 'pendencia'], permissoes: [], selecionado: false },
      ];

      // Distribui as permissões reais da API para os grupos corretos
      todas.forEach(p => {
        const grupo = this.gruposDePaginas.find(g => g.permissoesChave.some(chave => p.nome.includes(chave)));
        if (grupo) {
          grupo.permissoes.push(p);
        }
      });
      this.gruposDePaginas = this.gruposDePaginas.filter(g => g.permissoes.length > 0);
    });
  }

  // --- Funções do Modal ---
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

  // Seleciona ou deseleciona todas as permissões de um grupo
  toggleGrupoCompleto(grupo: GrupoDePagina, event: any): void {
    const isChecked = event.target.checked;
    grupo.selecionado = isChecked;
    grupo.permissoes.forEach(p => {
      this.permissoesSelecionadas.set(p.id_permissao, isChecked);
    });
  }

  // Atualiza o estado do checkbox principal de um grupo
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
  excluirPerfil = (id: number | undefined) => { if (id && confirm('Tem a certeza?')) this.perfilService.excluirPerfil(id).subscribe(() => this.carregarPerfis()); };
  toggleActionSelect = (index: number) => this.openActionIndex = this.openActionIndex === index ? null : index;
}