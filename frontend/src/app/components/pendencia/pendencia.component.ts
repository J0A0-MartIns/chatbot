import { Component, OnInit } from '@angular/core';
import { PendenciaService } from '../../services/pendencia.service';
import { Pendencia, AprovacaoPayload } from '../../models/pendencia.model';
import {FormsModule} from "@angular/forms";
import {NgForOf, NgIf} from "@angular/common";

// NOTA: Garanta que 'CommonModule' e 'FormsModule' estão no 'imports'
// do módulo que declara este componente (ex: app.module.ts).

@Component({
  selector: 'app-pendencia',
  templateUrl: './pendencia.component.html',
  imports: [
    FormsModule,
    NgIf,
    NgForOf
  ],
  styleUrls: ['./pendencia.component.css']
})
export class PendenciaComponent implements OnInit {
  pendencias: Pendencia[] = [];
  showModal = false;

  // O documento que será criado a partir da pendência
  docParaAprovar: AprovacaoPayload = this.criarPayloadVazio();
  // ID da pendência que está sendo aprovada
  pendenciaIdAtual: number | null = null;
  perguntaOriginal = '';

  constructor(private pendenciaService: PendenciaService) {}

  ngOnInit(): void {
    this.carregarPendencias();
  }

  carregarPendencias(): void {
    this.pendenciaService.listarPendencias().subscribe(data => {
      this.pendencias = data;
    });
  }

  criarPayloadVazio(): AprovacaoPayload {
    return {
      titulo: '',
      conteudo: '',
      palavras_chave: '',
      id_subtema: 0, // Ou um valor padrão
    };
  }

  // Abre o modal com os dados da pendência para aprovação
  abrirModalParaAprovar(pendencia: Pendencia): void {
    this.pendenciaIdAtual = pendencia.id_pendencia;
    this.perguntaOriginal = pendencia.pergunta;
    // Preenche o formulário com sugestões
    this.docParaAprovar = {
      titulo: pendencia.pergunta, // Sugere a pergunta como título
      conteudo: pendencia.resposta, // Sugere a resposta antiga como base para o conteúdo
      palavras_chave: '',
      id_subtema: 0 // O admin deve selecionar
    };
    this.showModal = true;
  }

  fecharModal(): void {
    this.showModal = false;
    this.pendenciaIdAtual = null;
    this.docParaAprovar = this.criarPayloadVazio();
    this.perguntaOriginal = '';
  }

  // Função chamada pelo formulário do modal
  confirmarAprovacao(): void {
    if (!this.pendenciaIdAtual || !this.docParaAprovar.titulo || !this.docParaAprovar.conteudo || !this.docParaAprovar.id_subtema) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    this.pendenciaService.aprovarPendencia(this.pendenciaIdAtual, this.docParaAprovar).subscribe({
      next: () => {
        alert('Pendência aprovada e adicionada à base com sucesso!');
        this.carregarPendencias(); // Recarrega a lista para remover a pendência aprovada
        this.fecharModal();
      },
      error: (err) => alert(`Erro ao aprovar pendência: ${err.error?.message || 'Tente novamente.'}`)
    });
  }

  rejeitarPendencia(id: number | undefined): void {
    if (!id) return;
    if (confirm('Tem certeza que deseja rejeitar e excluir esta pendência?')) {
      this.pendenciaService.rejeitarPendencia(id).subscribe({
        next: () => this.carregarPendencias(),
        error: (err) => alert(`Erro ao rejeitar pendência: ${err.error?.message || 'Tente novamente.'}`)
      });
    }
  }

  formatarData(dataStr: string): string {
    return new Date(dataStr).toLocaleString('pt-BR');
  }
}
