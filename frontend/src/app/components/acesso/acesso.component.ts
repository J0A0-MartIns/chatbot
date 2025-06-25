import { Component, OnInit } from '@angular/core';
import { PerfilService } from '../../services/perfil.service';
import { Perfil, Permissao } from '../../models/perfil.model';
import {NgForOf} from "@angular/common";
import {FormsModule} from "@angular/forms";

// NOTA: Garanta que 'CommonModule' e 'FormsModule' estão no 'imports'
// do módulo que declara este componente (ex: app.module.ts).

@Component({
  selector: 'app-acesso',
  templateUrl: './acesso.component.html',
  imports: [
    NgForOf,
    FormsModule
  ],
  styleUrls: ['./acesso.component.css']
})
export class AcessoComponent implements OnInit {
  perfis: Perfil[] = [];
  todasAsPermissoes: Permissao[] = [];

  modalAberto = false;
  isEditMode = false;
  openActionIndex: number | null = null;

  // Dados do perfil sendo criado/editado no modal
  perfilEmEdicao: { id?: number; nome: string } = { nome: '' };
  // Mapa para controlar os checkboxes: Map<id_permissao, isChecked>
  permissoesSelecionadas = new Map<number, boolean>();

  constructor(private perfilService: PerfilService) {}

  ngOnInit(): void {
    this.carregarPerfis();
    this.carregarTodasPermissoes();
  }

  carregarPerfis(): void {
    this.perfilService.getPerfis().subscribe(data => this.perfis = data);
  }

  carregarTodasPermissoes(): void {
    this.perfilService.getTodasPermissoes().subscribe(data => this.todasAsPermissoes = data);
  }

  abrirModalParaCriar(): void {
    this.isEditMode = false;
    this.perfilEmEdicao = { nome: '' };
    this.permissoesSelecionadas.clear(); // Limpa seleções anteriores
    this.modalAberto = true;
  }

  abrirModalParaEditar(perfil: Perfil): void {
    this.isEditMode = true;
    this.perfilEmEdicao = { id: perfil.id_perfil, nome: perfil.nome };

    // Preenche o mapa de checkboxes com base nas permissões atuais do perfil
    this.permissoesSelecionadas.clear();
    const permissoesDoPerfilIds = new Set(perfil.Permissaos.map(p => p.id_permissao));
    this.todasAsPermissoes.forEach(p => {
      this.permissoesSelecionadas.set(p.id_permissao, permissoesDoPerfilIds.has(p.id_permissao));
    });

    this.modalAberto = true;
  }

  togglePermissao(id_permissao: number): void {
    const currentState = this.permissoesSelecionadas.get(id_permissao) || false;
    this.permissoesSelecionadas.set(id_permissao, !currentState);
  }

  salvarPerfil(): void {
    const nome = this.perfilEmEdicao.nome;
    const permissoesIds = Array.from(this.permissoesSelecionadas.entries())
        .filter(([id, isSelected]) => isSelected)
        .map(([id]) => id);

    if (this.isEditMode && this.perfilEmEdicao.id) {
      this.perfilService.atualizarPerfil(this.perfilEmEdicao.id, nome, permissoesIds).subscribe(() => {
        this.carregarPerfis();
        this.fecharModal();
      });
    } else {
      this.perfilService.criarPerfil(nome, permissoesIds).subscribe(() => {
        this.carregarPerfis();
        this.fecharModal();
      });
    }
  }

  excluirPerfil(id: number | undefined): void {
    if (!id) return;
    if(confirm('Tem certeza que deseja excluir este perfil? Esta ação não pode ser desfeita.')) {
      this.perfilService.excluirPerfil(id).subscribe(() => this.carregarPerfis());
    }
  }

  fecharModal(): void {
    this.modalAberto = false;
  }

  toggleActionSelect(index: number): void {
    this.openActionIndex = this.openActionIndex === index ? null : index;
  }
}
