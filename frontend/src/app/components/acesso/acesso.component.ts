import { Component, OnInit } from '@angular/core';
import { PerfilService } from '../../services/perfil.service';
import { Perfil, Permissao } from '../../models/perfil.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Interface para definir a estrutura dos nossos grupos de páginas
interface GrupoDePagina {
  nomeExibicao: string; // Ex: "Acesso à Base de Conhecimento"
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
  // Dados da Tabela
  perfis: Perfil[] = [];

  // Dados do Modal
  modalAberto = false;
  isEditMode = false;
  perfilEmEdicao: Partial<Perfil> = {};
  gruposDePaginas: GrupoDePagina[] = [];
  permissoesSelecionadas = new Map<number, boolean>();

  // Controlo da UI
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
        { nomeExibicao: 'Acesso à Gestão de Utilizadores', permissoesChave: ['usuario', 'perfi', 'permis'], permissoes: [], selecionado: false },
        { nomeExibicao: 'Acesso à Base de Conhecimento', permissoesChave: ['documento', 'categoria'], permissoes: [], selecionado: false },
        { nomeExibicao: 'Acesso ao Dashboard e Relatórios', permissoesChave: ['dashboard', 'relatorio', 'pendencia', 'listar_'], permissoes: [], selecionado: false },
      ];

      // Distribui as permissões reais da API para os grupos corretos
      todas.forEach(p => {
        const grupo = this.gruposDePaginas.find(g => g.permissoesChave.some(chave => p.nome.includes(chave)));
        if (grupo) {
          grupo.permissoes.push(p);
        }
      });
      // Remove da vista quaisquer grupos que não tenham permissões associadas
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
    // Preenche o mapa com as permissões que o perfil já possui
    perfil.Permissoes.forEach(p => this.permissoesSelecionadas.set(p.id_permissao, true));
    this.atualizarCheckboxDosGrupos();
    this.modalAberto = true;
  }

  fecharModal(): void {
    this.modalAberto = false;
  }

  salvarPerfil(): void {
    const nome = this.perfilEmEdicao.nome;
    const permissoesIds = Array.from(this.permissoesSelecionadas.entries())
        .filter(([, isSelected]) => isSelected)
        .map(([id]) => id);

    if (!nome) {
      alert('O nome do perfil é obrigatório.');
      return;
    }

    const acao = this.isEditMode
        ? this.perfilService.atualizarPerfil(this.perfilEmEdicao.id_perfil!, nome, permissoesIds)
        : this.perfilService.criarPerfil(nome, permissoesIds);

    acao.subscribe({
      next: () => {
        this.carregarPerfis();
        this.fecharModal();
      },
      error: (err) => alert(`Erro ao salvar perfil: ${err.error?.message || 'Tente novamente.'}`)
    });
  }

  // --- Lógica de Controlo dos Checkboxes ---

  toggleGrupoCompleto(grupo: GrupoDePagina, event: any): void {
    const isChecked = event.target.checked;
    grupo.selecionado = isChecked;
    grupo.permissoes.forEach(p => {
      this.permissoesSelecionadas.set(p.id_permissao, isChecked);
    });
  }

  atualizarCheckboxDosGrupos(): void {
    this.gruposDePaginas.forEach(grupo => {
      const todasDoGrupoEstaoSelecionadas = grupo.permissoes.length > 0 && grupo.permissoes.every(p => this.permissoesSelecionadas.get(p.id_permissao));
      grupo.selecionado = todasDoGrupoEstaoSelecionadas;
    });
  }

  // --- Funções da Tabela ---

  excluirPerfil(id: number | undefined): void {
    if (!id) return;
    if (confirm('Tem a certeza que deseja excluir este perfil? Esta ação não pode ser desfeita.')) {
      this.perfilService.excluirPerfil(id).subscribe(() => this.carregarPerfis());
    }
  }

  toggleActionSelect(index: number): void {
    this.openActionIndex = this.openActionIndex === index ? null : index;
  }
}
