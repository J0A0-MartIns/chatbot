import {Component, HostListener, OnInit} from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { PendenciaService } from '../../services/pendencia.service';
import { Pendencia, AprovacaoPayload } from '../../models/pendencia.model';
import { TemaService } from '../../services/tema.service';
import { SubtemaService } from '../../services/subtema.service';
import { Tema } from '../../models/tema.model';
import { Subtema } from '../../models/subtema.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BaseService } from '../../services/base.service';

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
  openActionIndex: number | null = null;
  dropdownPosition = { top: '0px', left: '0px' };
  arquivoParaUpload: File | null = null;
  motivoPendencia: string | null = null;

  constructor(
      private pendenciaService: PendenciaService,
      private temaService: TemaService,
      private subtemaService: SubtemaService,
      private baseService: BaseService
  ) {
    this.docParaAprovar = this.criarPayloadVazio();
  }

  ngOnInit(): void {
    this.carregarPendencias();
    this.carregarTemas();
  }

  onFileSelected(event: any): void {
    const file = event.target.files?.[0];
    if (file) {
      this.arquivoParaUpload = file;
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (target.closest('.icon-button') || target.closest('.global-dropdown')) {
      return;
    }
    this.openActionIndex = null;
  }

  carregarPendencias(): void {
    this.pendenciaService.listarPendencias().subscribe({
      next: (data) => this.pendencias = data,
      error: (err) => console.error("ERRO ao carregar pendências:", err)
    });
  }

  carregarTemas(): void {
    this.temaService.getTemas().subscribe(data => this.temas = data);
  }

  onTemaChangeNoModal(): void {
    this.subtemasDoTemaSelecionado = [];
    if (this.docParaAprovar) this.docParaAprovar.id_subtema = 0;
    if (this.idTemaSelecionadoNoModal) {
      this.subtemaService.getSubtemasPorTema(this.idTemaSelecionadoNoModal)
          .subscribe(data => this.subtemasDoTemaSelecionado = data);
    }
  }

  abrirModalParaAprovar(pendencia: Pendencia): void {
    this.openActionIndex = null;
    this.pendenciaIdAtual = pendencia.id_pendencia;
    this.perguntaOriginal = pendencia.pergunta;
    this.perguntaResumo = pendencia.pergunta.length > 150 ? `${pendencia.pergunta.substring(0, 150)}...` : pendencia.pergunta;
    this.motivoPendencia = pendencia.motivo;
    this.docParaAprovar = {
      titulo: pendencia.pergunta,
      conteudo: '',
      palavras_chave: '',
      id_subtema: 0,
      sugestao_tema: pendencia.sugestao_tema,
      sugestao_subtema: pendencia.sugestao_subtema
    };
    this.idTemaSelecionadoNoModal = null;
    this.novoTemaNome = '';
    this.novoSubtemaNome = '';
    this.subtemasDoTemaSelecionado = [];
    this.showModal = true;
  }

  fecharModal(): void {
    this.openActionIndex = null;
    this.showModal = false;
  }

  async confirmarAprovacao(): Promise<void> {
    try {
      if (!this.pendenciaIdAtual)
        return;
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
      } else if (this.docParaAprovar.id_subtema && this.docParaAprovar.id_subtema > 0) {
        subtemaIdFinal = this.docParaAprovar.id_subtema;
      } else {
        alert('Por favor, selecione ou crie um subtema.');
        return;
      }

      this.docParaAprovar.id_subtema = subtemaIdFinal;
      const novoDocumento = await lastValueFrom(this.pendenciaService.aprovarPendencia(this.pendenciaIdAtual, this.docParaAprovar));

      if (this.arquivoParaUpload && novoDocumento.id_documento) {
        await lastValueFrom(this.baseService.uploadArquivo(novoDocumento.id_documento, this.arquivoParaUpload));
      }

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
    return { titulo: '', conteudo: '', palavras_chave: '', id_subtema: 0 };
  }

  toggleActionSelect(index: number, event: MouseEvent): void {
    event.stopPropagation();
    if (this.openActionIndex === index) {
      this.openActionIndex = null;
    } else {
      const button = event.target as HTMLElement;
      const rect = button.getBoundingClientRect();
      this.dropdownPosition = {
        top: `${rect.bottom + window.scrollY}px`,
        left: `${rect.left + window.scrollX - 100}px`
      };
      this.openActionIndex = index;
    }
  }
}