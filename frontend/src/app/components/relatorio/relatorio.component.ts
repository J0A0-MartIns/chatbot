import { Component, OnInit } from '@angular/core';
import { ChatMessage } from '../../models/chat-message.model';
import {NgForOf, NgIf} from "@angular/common";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-relatorio',
  templateUrl: './relatorio.component.html',
  imports: [
    NgIf,
    NgForOf,
    FormsModule
  ],
  styleUrls: ['./relatorio.component.css']
})
export class RelatorioComponent implements OnInit {

  dadosFiltrados: { tema: string; quantidade: number }[] = [];

  filtroMes: number = new Date().getMonth() + 1;
  filtroAno: number = new Date().getFullYear();
  dataInicio: string = '';
  dataFim: string = '';
  anosDisponiveis: number[] = [];
  meses = [
    { nome: 'Janeiro', valor: 1 },
    { nome: 'Fevereiro', valor: 2 },
    { nome: 'Março', valor: 3 },
    { nome: 'Abril', valor: 4 },
    { nome: 'Maio', valor: 5 },
    { nome: 'Junho', valor: 6 },
    { nome: 'Julho', valor: 7 },
    { nome: 'Agosto', valor: 8 },
    { nome: 'Setembro', valor: 9 },
    { nome: 'Outubro', valor: 10 },
    { nome: 'Novembro', valor: 11 },
    { nome: 'Dezembro', valor: 12 }
  ];
  registrosChat: ChatMessage[] = [];
  registrosFiltrados: ChatMessage[] = [];
  filtroData: string = '';
  filtroTema: string = '';
  filtroMicrotema: string = '';
  microtemasDisponiveis: string[] = [];
  temasUnicos: string[] = [];

  ngOnInit(): void {
    this.carregarRegistrosChat();
    this.temasUnicos = Array.from(new Set(this.registrosChat.map(r => r.tema))).sort();
    this.registrosFiltrados = [...this.registrosChat];
    this.definirAnosDisponiveis();
    this.filtroData = '';
    this.filtroTema = '';
    this.atualizarMicrotemasDisponiveis();
  }

  carregarRegistrosChat(): void {
    const dados = localStorage.getItem('consultasChatbot');
    this.registrosChat = dados ? JSON.parse(dados) : [];
  }

  aplicarFiltroVisualizacoes(): void {
    this.registrosFiltrados = this.registrosChat.filter(item => {
      let passaFiltroTema = true;
      let passaFiltroMicroTema = true;
      let passaFiltroMes = true;
      let passaFiltroAno = true;

      if (this.filtroTema) {
        passaFiltroTema = item.tema === this.filtroTema;
      }

      if (this.filtroMicrotema) {
        passaFiltroMicroTema = item.microTema === this.filtroMicrotema;
      }

      this.atualizarMicrotemasDisponiveis();

      const dataItem = new Date(item.dataHora ?? '');
      passaFiltroMes = dataItem.getMonth() + 1 === this.filtroMes;
      passaFiltroAno = dataItem.getFullYear() === this.filtroAno;

      return passaFiltroTema && passaFiltroMicroTema && passaFiltroMes && passaFiltroAno;
    });
  }

  formatarData(dataISO?: string): string {
    if (!dataISO) return '-';
    const data = new Date(dataISO);
    if (isNaN(data.getTime())) return '-';
    return data.toLocaleString();
  }

  atualizarMicrotemasDisponiveis(): void {
    if (!this.filtroTema) {
      const todosMicrotemas = this.registrosChat.map(r => r.microTema).filter(Boolean);
      this.microtemasDisponiveis = Array.from(new Set(todosMicrotemas)).sort();
    } else {
      const microtemas = this.registrosChat
          .filter(r => r.tema === this.filtroTema)
          .map(r => r.microTema)
          .filter(Boolean);
      this.microtemasDisponiveis = Array.from(new Set(microtemas)).sort();
    }
    if (!this.microtemasDisponiveis.includes(this.filtroMicrotema)) {
      this.filtroMicrotema = '';
    }
  }

  definirAnosDisponiveis(): void {
    const anosSet = new Set<number>();
    for (const item of this.registrosChat) {
      if (item.dataHora) {
        const ano = new Date(item.dataHora).getFullYear();
        anosSet.add(ano);
      }
    }
    this.anosDisponiveis = Array.from(anosSet).sort((a, b) => b - a);
  }

  filtrarPorPeriodo(): void {
    const contagemTemas: { [tema: string]: number } = {};

    const dataInicioDate = this.dataInicio ? new Date(this.dataInicio) : null;
    const dataFimDate = this.dataFim ? new Date(this.dataFim) : null;

    for (const reg of this.registrosChat) {
      if (!reg.dataHora) continue;

      const data = new Date(reg.dataHora);
      if (isNaN(data.getTime())) continue;

      if (dataInicioDate && data < dataInicioDate) continue;
      if (dataFimDate && data > dataFimDate) continue;

      contagemTemas[reg.tema] = (contagemTemas[reg.tema] || 0) + 1;
    }

    this.dadosFiltrados = Object.entries(contagemTemas).map(([tema, quantidade]) => ({
      tema,
      quantidade
    })).sort((a, b) => b.quantidade - a.quantidade);
  }

  getTextoAvaliacao(avaliacao?: string | null): string {
    if (!avaliacao) return 'Sem avaliação';
    if (avaliacao.toLowerCase() === 'util') return 'Útil';
    if (avaliacao.toLowerCase() === 'nao-util') return 'Não útil';
    return 'Sem avaliação';
  }
}
