import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { DashboardService } from '../../services/dashboard.service';
import {NgIf} from '@angular/common';
import {Chart, registerables} from "chart.js";

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  imports: [
    NgIf
  ],
     standalone: true,
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy{
  respostasEncontradasHoje = 0;
  usuariosAtivosCount = 0;
  pendenciasCount = 0;
  usuariosPendentesCount = 0;
  isLoading = true;
  private taxaRespostasChart: Chart | undefined;
  private volumeAtendimentosChart: Chart | undefined;

  constructor(
      private dashboardService: DashboardService,
      private router: Router
  ) {}

  ngOnInit(): void {
    this.carregarIndicadores();
  }

  ngAfterViewInit(): void {
    this.carregarDadosDosGraficos();
  }

  ngOnDestroy(): void {
    this.taxaRespostasChart?.destroy();
    this.volumeAtendimentosChart?.destroy();
  }

  carregarIndicadores(): void {
    this.isLoading = true;
    this.dashboardService.getStats().subscribe({
      next: (stats) => {
        this.respostasEncontradasHoje = stats.respostasEncontradasHoje;
        this.usuariosAtivosCount = stats.usuariosAtivosCount;
        this.usuariosPendentesCount = stats.usuariosPendentesCount;
        this.pendenciasCount = stats.pendenciasCount;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar indicadores do dashboard:', err);
        this.isLoading = false;
      }
    });
  }

  carregarDadosDosGraficos(): void {
    this.dashboardService.getTaxaRespostas().subscribe(data => {
      this.criarGraficoTaxaRespostas(data.encontradas, data.naoEncontradas);
    });

    this.dashboardService.getVolumeAtendimentos().subscribe(data => {
      this.criarGraficoVolumeAtendimentos(data);
    });
  }

  criarGraficoTaxaRespostas(encontradas: number, naoEncontradas: number): void {
    const ctx = document.getElementById('taxaRespostasChart') as HTMLCanvasElement;
    if (!ctx) return;

    this.taxaRespostasChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Respostas Encontradas', 'Não Encontradas'],
        datasets: [{
          data: [encontradas, naoEncontradas],
          backgroundColor: ['#2f855a', '#e53e3e'],
          borderColor: '#ffffff',
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom' },
          title: { display: true, text: 'Taxa de Sucesso (Últimos 30 Dias)' }
        }
      }
    });
  }

  criarGraficoVolumeAtendimentos(data: any[]): void {
    const ctx = document.getElementById('volumeAtendimentosChart') as HTMLCanvasElement;
    if (!ctx) return;

    const labels = data.map(d => new Date(d.dia).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }));
    const counts = data.map(d => parseInt(d.count, 10));

    this.volumeAtendimentosChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Nº de Perguntas',
          data: counts,
          backgroundColor: 'rgba(47, 133, 90, 0.6)',
          borderColor: 'rgba(47, 133, 90, 1)',
          borderWidth: 1,
          borderRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: { y: { beginAtZero: true } },
        plugins: {
          legend: { display: false },
          title: { display: true, text: 'Volume de Perguntas (Últimos 7 Dias)' }
        }
      }
    });
  }

  irParaRelatorios(): void {
    this.router.navigate(['/relatorio']);
  }

  irParaPendencias(): void {
    this.router.navigate(['/pendencia']);
  }

  irParaUsuarios() {
    this.router.navigate(['/usuario']);
  }

  irParaPerfil() {
    this.router.navigate(['/acesso']);
  }
}
