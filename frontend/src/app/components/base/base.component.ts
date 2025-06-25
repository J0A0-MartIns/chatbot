import { Component, OnInit } from '@angular/core';
import { BaseService } from '../../services/base.service';
import { Documento } from '../../models/documento.model';
import {FormsModule} from "@angular/forms"; // Importa nosso modelo unificado

// NOTA IMPORTANTE: Para que *ngIf, *ngFor e [(ngModel)] funcionem,
// você deve adicionar 'CommonModule' e 'FormsModule' ao array 'imports'
// do módulo que declara este componente (ex: app.module.ts).

@Component({
  selector: 'app-base',
  templateUrl: './base.component.html',
  imports: [
    FormsModule
  ],
  // Se fosse um componente Standalone, a correção seria aqui:
  // standalone: true,
  // imports: [CommonModule, FormsModule]
})
export class BaseComponent implements OnInit {
  documentos: Documento[] = [];
  termoBusca: string = '';
  showModal = false;
  isEditMode = false;
  activeMenuIndex: number | null = null;

  // O documento sendo criado/editado no modal
  docEmEdicao: Documento = this.criarDocVazio();

  constructor(private baseService: BaseService) {}

  ngOnInit(): void {
    this.carregarDocumentos();
  }

  criarDocVazio(): Documento {
    return {
      titulo: '',
      conteudo: '',
      palavras_chave: '', // Agora é uma string
      ativo: true,
      usuario_id: 1, // Placeholder, deve vir do usuário logado
      id_subtema: 1, // Placeholder, deve vir de um select
    };
  }

  carregarDocumentos(): void {
    this.baseService.getDocumentos().subscribe({
      next: (data) => this.documentos = data,
      error: (err) => console.error('Erro ao carregar documentos:', err)
    });
  }

  docsFiltrados(): Documento[] {
    if (!this.termoBusca) {
      return this.documentos;
    }
    return this.documentos.filter(doc =>
        doc.titulo.toLowerCase().includes(this.termoBusca.toLowerCase())
    );
  }

  abrirModalParaCriar(): void {
    this.isEditMode = false;
    this.docEmEdicao = this.criarDocVazio();
    this.showModal = true;
  }

  abrirModalParaEditar(doc: Documento): void {
    this.isEditMode = true;
    // Cria uma cópia profunda para não alterar a lista diretamente
    this.docEmEdicao = JSON.parse(JSON.stringify(doc));
    this.showModal = true;
  }

  fecharModal(): void {
    this.showModal = false;
  }

  salvarDocumento(): void {
    if (this.isEditMode && this.docEmEdicao.id_documento) {
      // --- Lógica de Atualização ---
      this.baseService.atualizarDocumento(this.docEmEdicao.id_documento, this.docEmEdicao).subscribe({
        next: () => {
          this.carregarDocumentos();
          this.fecharModal();
        },
        error: (err) => console.error('Erro ao atualizar documento:', err)
      });
    } else {
      // --- Lógica de Criação ---
      this.baseService.criarDocumento(this.docEmEdicao).subscribe({
        next: () => {
          this.carregarDocumentos();
          this.fecharModal();
        },
        error: (err) => console.error('Erro ao criar documento:', err)
      });
    }
  }

  excluirDocumento(id: number | undefined): void {
    if (!id) return;
    if (confirm('Tem certeza que deseja excluir este documento?')) {
      this.baseService.excluirDocumento(id).subscribe({
        next: () => {
          this.documentos = this.documentos.filter(d => d.id_documento !== id);
        },
        error: (err) => console.error('Erro ao excluir documento:', err)
      });
    }
  }

  toggleAtivo(doc: Documento): void {
    if (!doc.id_documento) return;
    const novoStatus = !doc.ativo;
    this.baseService.atualizarAtivo(doc.id_documento, novoStatus).subscribe({
      next: (docAtualizado) => {
        // Atualiza o documento na lista local
        const index = this.documentos.findIndex(d => d.id_documento === doc.id_documento);
        if (index !== -1) {
          this.documentos[index].ativo = docAtualizado.ativo;
        }
      },
      error: (err) => console.error('Erro ao alterar status:', err)
    });
  }

  toggleActionMenu(index: number): void {
    this.activeMenuIndex = this.activeMenuIndex === index ? null : index;
  }
}
