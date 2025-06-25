import { Component, OnInit } from '@angular/core';
import { ReportService, RelatorioItem } from '../../services/report.service';
import {FormsModule} from "@angular/forms";
import {NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'app-relatorio',
  templateUrl: './relatorio.component.html',
  imports: [
    FormsModule,
    NgForOf,
    NgIf
  ],
  styleUrls: ['./relatorio.component.css']
})
export class RelatorioComponent implements OnInit {
  // Estado dos filtros
  filtroTema = '';
  filtroSubtema = '';
  dataInicio = '';
  dataFim = '';

  // Dados
  todosRegistros: RelatorioItem[] = []; // Guarda todos os dados para extrair os filtros
  registrosFiltrados: RelatorioItem[] = []; // Dados exibidos na tabela principal
  temasUnicos: string[] = [];
  microtemasUnicos: string[] = [];

  constructor(private reportService: ReportService) {}

  ngOnInit(): void {
    // Carrega todos os registros inicialmente para popular os menus de filtro
    this.carregarDadosIniciais();
  }

  carregarDadosIniciais(): void {
    this.reportService.buscarRelatorio({}).subscribe(data => {
      this.todosRegistros = data;
      this.registrosFiltrados = data; // Mostra tudo no início
      this.extrairOpcoesDeFiltro();
    });
  }

  extrairOpcoesDeFiltro(): void {
    const temas = new Set(this.todosRegistros.map(r => r.tema).filter(Boolean) as string[]);
    const subtemas = new Set(this.todosRegistros.map(r => r.sub_tema).filter(Boolean) as string[]);
    this.temasUnicos = Array.from(temas);
    this.microtemasUnicos = Array.from(subtemas);
  }

  // Função única para aplicar TODOS os filtros e buscar os dados
  aplicarFiltros(): void {
    const filtros = {
      tema: this.filtroTema || undefined,
      subtema: this.filtroSubtema || undefined,
      dataInicio: this.dataInicio || undefined,
      dataFim: this.dataFim || undefined
    };

    this.reportService.buscarRelatorio(filtros).subscribe(data => {
      this.registrosFiltrados = data;
    });
  }

  limparFiltros(): void {
    this.filtroTema = '';
    this.filtroSubtema = '';
    this.dataInicio = '';
    this.dataFim = '';
    this.aplicarFiltros(); // Recarrega os dados sem filtros
  }

  formatarData(data: string): string {
    if (!data) return 'N/A';
    return new Date(data).toLocaleString('pt-BR');
  }

  formatarAvaliacao(avaliacao: boolean | null): string {
    if (avaliacao === true) return 'Positiva';
    if (avaliacao === false) return 'Negativa';
    return 'Sem avaliação';
  }
}
