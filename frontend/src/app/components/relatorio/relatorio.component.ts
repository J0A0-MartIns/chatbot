import { Component, OnInit } from '@angular/core';
import { RelatorioService, RelatorioInteracao, RelatorioUsoSubtema } from '../../services/relatorio.service';
import { TemaService } from '../../services/tema.service';
import { SubtemaService } from '../../services/subtema.service';
import { Tema } from '../../models/tema.model';
import { Subtema } from '../../models/subtema.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {RouterLink} from "@angular/router";

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

  usoSubtemas: RelatorioUsoSubtema[] = [];
  dataInicio = '';
  dataFim = '';

  abaAtiva: 'interacoes' | 'uso' = 'interacoes';

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
    if (this.filtroTemaId) {
      this.subtemaService.getSubtemasPorTema(this.filtroTemaId).subscribe(data => this.subtemasDisponiveis = data);
    }
    this.aplicarFiltroInteracoes();
  }

  aplicarFiltroInteracoes(): void {
    const filtros = {
      id_tema: this.filtroTemaId || undefined,
      id_subtema: this.filtroSubtemaId || undefined,
      dataInicio: this.dataInicioInteracao || undefined,
      dataFim: this.dataFimInteracao || undefined
    };
    this.relatorioService.getRelatorioInteracoes(filtros).subscribe(data => this.interacoes = data);
  }

  aplicarFiltroPeriodo(): void {
    const filtros = {
      dataInicio: this.dataInicio || undefined,
      dataFim: this.dataFim || undefined
    };
    this.relatorioService.getRelatorioUsoSubtema(filtros).subscribe(data => this.usoSubtemas = data);
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
}