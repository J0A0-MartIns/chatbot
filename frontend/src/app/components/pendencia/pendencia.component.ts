import { Component, OnInit } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { PendenciaService } from '../../services/pendencia.service';
import { Pendencia, AprovacaoPayload } from '../../models/pendencia.model';
import { TemaService } from '../../services/tema.service';
import { SubtemaService } from '../../services/subtema.service';
import { Tema } from '../../models/tema.model';
import { Subtema } from '../../models/subtema.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pendencia',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pendencia.component.html',
  styleUrls: ['./pendencia.component.css']
})
export class PendenciaComponent implements OnInit {
  pendencias: Pendencia[] = [];
  temas: Tema[] = [];
  subtemasDoTemaSelecionado: Subtema[] = [];
  showModal = false;
  docParaAprovar: AprovacaoPayload;
  pendenciaIdAtual: number | null = null;
  perguntaOriginal = '';
  perguntaResumo = '';
  idTemaSelecionadoNoModal: number | null = null;
  novoTemaNome = '';
  novoSubtemaNome = '';

  constructor(
      private pendenciaService: PendenciaService,
      private temaService: TemaService,
      private subtemaService: SubtemaService
  ) {
    this.docParaAprovar = this.criarPayloadVazio();
  }

  ngOnInit(): void {
    this.carregarPendencias();
    this.carregarTemas();
  }

  carregarPendencias(): void {
    this.pendenciaService.listarPendencias().subscribe({
      next: (data) => {
        console.log('Dados de pendências recebidos da API:', data);
        this.pendencias = data;
      },
      error: (err) => {
        console.error("ERRO ao carregar pendências:", err);
        alert("Não foi possível carregar as solicitações. Verifique a consola para mais detalhes.");
      }
    });
  }

  carregarTemas(): void {
    this.temaService.getTemas().subscribe(data => this.temas = data);
  }

  onTemaChangeNoModal(): void {
    this.subtemasDoTemaSelecionado = [];
    if (this.docParaAprovar) {
      this.docParaAprovar.id_subtema = 0;
    }
    if (this.idTemaSelecionadoNoModal) {
      this.subtemaService.getSubtemasPorTema(this.idTemaSelecionadoNoModal)
          .subscribe(data => this.subtemasDoTemaSelecionado = data);
    }
  }

  abrirModalParaAprovar(pendencia: Pendencia): void {
    this.pendenciaIdAtual = pendencia.id_pendencia;
    this.perguntaOriginal = pendencia.pergunta;
    this.perguntaResumo = pendencia.pergunta.length > 150
        ? pendencia.pergunta.substring(0, 150) + '...'
        : pendencia.pergunta;

    this.docParaAprovar = {
      titulo: pendencia.pergunta,
      conteudo: pendencia.resposta,
      palavras_chave: '',
      id_subtema: 0,
    };
    this.idTemaSelecionadoNoModal = null;
    this.novoTemaNome = '';
    this.novoSubtemaNome = '';
    this.subtemasDoTemaSelecionado = [];
    this.showModal = true;
  }

  fecharModal(): void {
    this.showModal = false;
  }

  async confirmarAprovacao(): Promise<void> {
    try {
      if (!this.pendenciaIdAtual) return;

      let temaIdFinal: number;
      if (this.novoTemaNome.trim()) {
        const novoTema = await lastValueFrom(this.temaService.criarTema(this.novoTemaNome.trim()));
        temaIdFinal = novoTema.id_tema;
      } else if (this.idTemaSelecionadoNoModal) {
        temaIdFinal = this.idTemaSelecionadoNoModal;
      } else {
        alert('Por favor, selecione ou crie um tema.');
        return;
      }

      let subtemaIdFinal: number;
      if (this.novoSubtemaNome.trim()) {
        const novoSubtema = await lastValueFrom(this.subtemaService.criarSubtema(this.novoSubtemaNome.trim(), temaIdFinal));
        subtemaIdFinal = novoSubtema.id_subtema;
      } else if (this.docParaAprovar.id_subtema) {
        subtemaIdFinal = this.docParaAprovar.id_subtema;
      } else {
        alert('Por favor, selecione ou crie um subtema.');
        return;
      }

      this.docParaAprovar.id_subtema = subtemaIdFinal;
      await lastValueFrom(this.pendenciaService.aprovarPendencia(this.pendenciaIdAtual, this.docParaAprovar));

      alert('Pendência aprovada e adicionada à base com sucesso!');
      this.carregarPendencias();
      this.carregarTemas();
      this.fecharModal();

    } catch (error) {
      console.error('Erro ao aprovar pendência:', error);
      alert('Ocorreu um erro ao aprovar a pendência.');
    }
  }

  rejeitarPendencia(id: number | undefined): void {
    if (!id) return;
    if (confirm('Tem a certeza que deseja rejeitar esta solicitação?')) {
      this.pendenciaService.rejeitarPendencia(id).subscribe(() => this.carregarPendencias());
    }
  }

  formatarData(dataStr: string): string {
    return new Date(dataStr).toLocaleString('pt-BR');
  }

  private criarPayloadVazio(): AprovacaoPayload {
    return {
      titulo: '',
      conteudo: '',
      palavras_chave: '',
      id_subtema: 0,
    };
  }
}
