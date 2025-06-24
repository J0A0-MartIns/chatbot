import { Component, OnInit } from '@angular/core';
import { ReportService, RelatorioItem } from '../../services/report.service';

@Component({
  selector: 'app-relatorio',
  templateUrl: './relatorio.component.html',
  styleUrls: ['./relatorio.component.css']
})
export class RelatorioComponent implements OnInit {
  // Filtros
  filtroTema: string = '';
  filtroMicrotema: string = '';
  dataInicio: string = '';
  dataFim: string = '';

  // Listas
  registros: RelatorioItem[] = [];
  registrosFiltrados: RelatorioItem[] = [];

  temasUnicos: string[] = [];
  microtemasDisponiveis: string[] = [];

  dadosFiltrados: { tema: string, quantidade: number }[] = [];

  constructor(private reportService: ReportService) {}

  ngOnInit(): void {
    this.buscarTodosRegistros();
  }

  buscarTodosRegistros(): void {
    this.reportService.buscarRelatorio({}).subscribe({
      next: (res) => {
        this.registros = res;
        this.registrosFiltrados = res;
        this.extrairTemasEMicrotemas();
      },
      error: () => alert('Erro ao carregar relatórios.')
    });
  }

  extrairTemasEMicrotemas(): void {
    const temasSet = new Set<string>();
    const microtemasSet = new Set<string>();

    this.registros.forEach(item => {
      if (item.tema) temasSet.add(item.tema);
      if (item.sub_tema) microtemasSet.add(item.sub_tema);
    });

    this.temasUnicos = Array.from(temasSet);
    this.microtemasDisponiveis = Array.from(microtemasSet);
  }

  aplicarFiltroVisualizacoes(): void {
    this.registrosFiltrados = this.registros.filter(item => {
      const condTema = this.filtroTema ? item.tema === this.filtroTema : true;
      const condMicro = this.filtroMicrotema ? item.sub_tema === this.filtroMicrotema : true;
      return condTema && condMicro;
    });
  }

  filtrarPorPeriodo(): void {
    this.reportService.buscarRelatorio({
      dataInicio: this.dataInicio,
      dataFim: this.dataFim
    }).subscribe({
      next: (res) => {
        const contagem: { [tema: string]: number } = {};

        res.forEach(item => {
          if (!item.tema) return;
          contagem[item.tema] = (contagem[item.tema] || 0) + 1;
        });

        this.dadosFiltrados = Object.entries(contagem).map(([tema, quantidade]) => ({
          tema,
          quantidade
        }));
      },
      error: () => alert('Erro ao filtrar por período.')
    });
  }

  formatarData(data: string): string {
    return new Date(data).toLocaleString();
  }
}
