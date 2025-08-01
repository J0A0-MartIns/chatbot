import {Component, OnInit} from '@angular/core';
import {RelatorioService, RelatorioInteracao, RelatorioUsoSubtema} from '../../services/relatorio.service';
import {TemaService} from '../../services/tema.service';
import {SubtemaService} from '../../services/subtema.service';
import {Tema} from '../../models/tema.model';
import {Subtema} from '../../models/subtema.model';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
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
    ) {
    }

    ngOnInit(): void {
        this.aplicarFiltroInteracoes();
        this.aplicarFiltroPeriodo();
        this.carregarFiltros();
        this.inicializarFiltros();
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

    inicializarFiltros(): void {
        const hoje = new Date();
        const trintaDiasAtras = new Date();
        trintaDiasAtras.setDate(hoje.getDate() - 30);

        this.dataFimInteracao = hoje.toISOString().split('T')[0];
        this.dataInicioInteracao = trintaDiasAtras.toISOString().split('T')[0];
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

    exportarParaPlanilha(): void {
        if (this.dataInicioInteracao && this.dataFimInteracao && !this.validarIntervaloData())
            return;

        let dataInicio = this.dataInicioInteracao;
        let dataFim = this.dataFimInteracao;

        if (!dataInicio || !dataFim) {
            const hoje = new Date();
            const trintaDiasAtras = new Date();
            trintaDiasAtras.setDate(hoje.getDate() - 30);
            dataFim = hoje.toISOString().split('T')[0];
            dataInicio = trintaDiasAtras.toISOString().split('T')[0];
        }

        const filtros = {
            id_tema: this.filtroTemaId || undefined,
            id_subtema: this.filtroSubtemaId || undefined,
            dataInicio: this.dataInicioInteracao || undefined,
            dataFim: this.dataFimInteracao || undefined,
            exportar: true
        };

        this.relatorioService.getRelatorioInteracoes(filtros).subscribe(data => {
            if (data.rows.length === 0) {
                alert("Não há dados para exportar com os filtros selecionados.");
                return;
            }

            const temaSelecionado = this.temasDisponiveis.find(t => t.id_tema === this.filtroTemaId)?.nome || 'Todos';
            const subtemaSelecionado = this.subtemasDisponiveis.find(s => s.id_subtema === this.filtroSubtemaId)?.nome || 'Todos';

            const cabecalhoRelatorio = [
                ['Relatório de Interações do Chatbot'],
                [],
                ['Período:', `${this.formatarData(dataInicio)} a ${this.formatarData(dataFim)}`],
                ['Filtro de Tema:', temaSelecionado],
                ['Filtro de Subtema:', subtemaSelecionado],
                [],
                []
            ];

            const cabecalhoTabela = ['Data/Hora', 'Usuário', 'Pergunta', 'Resposta', 'Tema', 'Subtema', 'Documento', 'Avaliação'];

            const dadosTabela = data.rows.map(item => [
                this.formatarData(item.data_atendimento),
                item.usuario,
                item.pergunta_usuario,
                item.resposta_gerada,
                item.tema,
                item.sub_tema,
                item.documento,
                this.formatarAvaliacao(item.avaliacao)
            ]);

            const dadosCompletos = [cabecalhoTabela, ...dadosTabela];
            const wsInteracoes: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(cabecalhoRelatorio);
            XLSX.utils.sheet_add_aoa(wsInteracoes, dadosCompletos, {origin: -1});
            //Para mesclar da coluna A até H na primeira linha
            wsInteracoes['!merges'] = [{s: {r: 0, c: 0}, e: {r: 0, c: 7}}];

            wsInteracoes['!cols'] = [{wch: 20}, {wch: 25}, {wch: 50}, {wch: 50}, {wch: 25}, {wch: 25}, {wch: 30}, {wch: 15}];

            const resumoDocs: { [key: string]: { util: number, naoUtil: number, total: number } } = {};
            data.rows.forEach(item => {
                if (item.documento && item.documento !== 'N/A' && item.avaliacao !== null) {
                    if (!resumoDocs[item.documento]) {
                        resumoDocs[item.documento] = {util: 0, naoUtil: 0, total: 0};
                    }
                    if (item.avaliacao === true) {
                        resumoDocs[item.documento].util++;
                    } else if (item.avaliacao === false) {
                        resumoDocs[item.documento].naoUtil++;
                    }
                    resumoDocs[item.documento].total++;
                }
            });

            const dadosResumo = Object.keys(resumoDocs).map(docNome => {
                const stats = resumoDocs[docNome];
                const taxaUtil = stats.total > 0 ? (stats.util / stats.total * 100).toFixed(2) + '%' : '0.00%';
                const taxaNaoUtil = stats.total > 0 ? (stats.naoUtil / stats.total * 100).toFixed(2) + '%' : '0.00%';
                return {
                    'Documento': docNome,
                    'Nº de Avaliações': stats.total,
                    'Útil': stats.util,
                    'Não Útil': stats.naoUtil,
                    'Taxa de Utilidade': taxaUtil,
                    'Taxa de Rejeição': taxaNaoUtil,
                };
            });

            const wsResumo: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dadosResumo);
            wsResumo['!cols'] = [{wch: 40}, {wch: 20}, {wch: 10}, {wch: 10}, {wch: 20}, {wch: 20}];

            const workbook: XLSX.WorkBook = {
                Sheets: {'Interacoes': wsInteracoes, 'Resumo de Documentos': wsResumo},
                SheetNames: ['Interacoes', 'Resumo de Documentos']
            };

            const nomeArquivo = `Relatorio_Interacoes_${new Date().toLocaleDateString('pt-BR').replace(/\//g, '-')}.xlsx`;
            XLSX.writeFile(workbook, nomeArquivo);
        });
    }
}