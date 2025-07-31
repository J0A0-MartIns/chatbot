import { Component, OnInit } from '@angular/core';
import { RelatorioService, RelatorioInteracao, RelatorioUsoSubtema } from '../../services/relatorio.service';
import { TemaService } from '../../services/tema.service';
import { SubtemaService } from '../../services/subtema.service';
import { Tema } from '../../models/tema.model';
import { Subtema } from '../../models/subtema.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {RouterLink} from "@angular/router";
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-relatorio',
  standalone: true,
    imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './relatorio.component.html',
  styleUrls: ['./relatorio.component.css']
})
export class RelatorioComponent implements OnInit {
  interacoes: RelatorioInteracao[] = [];
  filtroTemaId: number | null = null;
  filtroSubtemaId: number | null = null;
  temasDisponiveis: Tema[] = [];
  subtemasDisponiveis: Subtema[] = [];
  dataInicioInteracao = '';
  dataFimInteracao = '';
  paginaAtualInteracoes = 1;
  itensPorPaginaInteracoes = 10;
  totalInteracoes = 0;

  usoSubtemas: RelatorioUsoSubtema[] = [];
  dataInicio = '';
  dataFim = '';
  paginaAtualUso = 1;
  itensPorPaginaUso = 10;
  totalUsoSubtemas = 0;

  abaAtiva: 'interacoes' | 'uso' = 'interacoes';
  opcoesItensPorPagina = [10, 20, 30, 40, 50];

  constructor(
      private relatorioService: RelatorioService,
      private temaService: TemaService,
      private subtemaService: SubtemaService
  ) {}

  ngOnInit(): void {
    this.aplicarFiltroInteracoes();
    this.aplicarFiltroPeriodo();
    this.carregarFiltros();
  }

  inicializarFiltrosData(): void {
    const hoje = new Date();
    const trintaDiasAtras = new Date();
    trintaDiasAtras.setDate(hoje.getDate() - 30);

    this.dataFimInteracao = hoje.toISOString().split('T')[0];
    this.dataInicioInteracao = trintaDiasAtras.toISOString().split('T')[0];

    this.dataFim = hoje.toISOString().split('T')[0];
    this.dataInicio = trintaDiasAtras.toISOString().split('T')[0];
  }

  validarIntervaloData(): boolean {
    const inicio = new Date(this.dataInicioInteracao);
    const fim = new Date(this.dataFimInteracao);
    const diffTime = Math.abs(fim.getTime() - inicio.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 30) {
      alert('O intervalo entre as datas não pode ser superior a 30 dias.');
      return false;
    }
    return true;
  }

  selecionarAba(aba: 'interacoes' | 'uso'): void {
    this.abaAtiva = aba;
    if (aba === 'uso' && this.usoSubtemas.length === 0) {
      this.aplicarFiltroPeriodo();
    }
  }

  carregarFiltros(): void {
    this.temaService.getTemas().subscribe(data => this.temasDisponiveis = data);
  }

  onTemaChange(): void {
    this.filtroSubtemaId = null;
    this.subtemasDisponiveis = [];
    this.paginaAtualInteracoes = 1;
    if (this.filtroTemaId) {
      this.subtemaService.getSubtemasPorTema(this.filtroTemaId).subscribe(data => this.subtemasDisponiveis = data);
    }
    this.aplicarFiltroInteracoes();
  }

  aplicarFiltroInteracoes(): void {
    if (!this.validarIntervaloData())
      return;
    const filtros = {
      id_tema: this.filtroTemaId || undefined,
      id_subtema: this.filtroSubtemaId || undefined,
      dataInicio: this.dataInicioInteracao || undefined,
      dataFim: this.dataFimInteracao || undefined,
      page: this.paginaAtualInteracoes,
      pageSize: this.itensPorPaginaInteracoes
    };
    this.relatorioService.getRelatorioInteracoes(filtros).subscribe(data => {
      this.interacoes = data.rows;
      this.totalInteracoes = data.count;
    });
  }

  onFiltroInteracoesClick(): void {
    this.paginaAtualInteracoes = 1;
    this.aplicarFiltroInteracoes();
  }

  mudarPaginaInteracoes(novaPagina: number): void {
    this.paginaAtualInteracoes = novaPagina;
    this.aplicarFiltroInteracoes();
  }

  onItensPorPaginaInteracoesChange(): void {
    this.paginaAtualInteracoes = 1;
    this.aplicarFiltroInteracoes();
  }

  get totalPaginasInteracoes(): number {
    return Math.ceil(this.totalInteracoes / this.itensPorPaginaInteracoes);
  }

  aplicarFiltroPeriodo(): void {
    const filtros = {
      dataInicio: this.dataInicio || undefined,
      dataFim: this.dataFim || undefined,
      page: this.paginaAtualUso,
      pageSize: this.itensPorPaginaUso
    };
    this.relatorioService.getRelatorioUsoSubtema(filtros).subscribe(data => {
      this.usoSubtemas = data.rows;
      this.totalUsoSubtemas = data.count;
    });
  }

  onFiltroPeriodoClick(): void {
    this.paginaAtualUso = 1;
    this.aplicarFiltroPeriodo();
  }

  mudarPaginaUso(novaPagina: number): void {
    this.paginaAtualUso = novaPagina;
    this.aplicarFiltroPeriodo();
  }

  onItensPorPaginaUsoChange(): void {
    this.paginaAtualUso = 1;
    this.aplicarFiltroPeriodo();
  }

  get totalPaginasUso(): number {
    return Math.ceil(this.totalUsoSubtemas / this.itensPorPaginaUso);
  }

  formatarData(data: string): string {
    if (!data) return 'Sem dados';
    return new Date(data).toLocaleString('pt-BR');
  }

  formatarAvaliacao(avaliacao: boolean | null): string {
    if (avaliacao === true) return 'Útil';
    if (avaliacao === false) return 'Não Útil';
    return 'Sem avaliação';
  }

  exportarParaExcel(): void {
    if (!this.validarIntervaloData())
      return;
    const filtros = {
      id_tema: this.filtroTemaId || undefined,
      id_subtema: this.filtroSubtemaId || undefined,
      dataInicio: this.dataInicioInteracao || undefined,
      dataFim: this.dataFimInteracao || undefined,
      exportar: true
    };

    this.relatorioService.getRelatorioInteracoes(filtros).subscribe(data => {
      if(data.rows.length === 0){
        alert("Não há dados para exportar com os filtros selecionados.");
        return;
      }

      const dadosExportacao = data.rows.map(item => ({
        'Data/Hora': this.formatarData(item.data_atendimento),
        'Usuário': item.usuario,
        'Pergunta': item.pergunta_usuario,
        'Resposta': item.resposta_gerada,
        'Tema': item.tema,
        'Subtema': item.sub_tema,
        'Documento': item.documento,
        'Avaliação': this.formatarAvaliacao(item.avaliacao)
      }));

      const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dadosExportacao);
      const workbook: XLSX.WorkBook = { Sheets: { 'Interacoes': worksheet }, SheetNames: ['Interacoes'] };
      const nomeArquivo = `Relatorio_Interacoes_${new Date().toLocaleDateString('pt-BR').replace(/\//g, '-')}.xlsx`;
      XLSX.writeFile(workbook, nomeArquivo);
    });
  }
}