import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DashboardService } from '../../services/dashboard.service';
import {CommonModule, NgIf} from '@angular/common'; // Importe se o componente for standalone

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  imports: [
    NgIf
  ],
  // Se for standalone, adicione o CommonModule aqui
  // standalone: true,
  // imports: [CommonModule]
})
export class DashboardComponent implements OnInit {
  perguntasHojeCount = 0;
  pendenciasCount = 0;
  isLoading = true; // Adicionado para feedback visual

  constructor(
      private dashboardService: DashboardService,
      private router: Router
  ) {}

  ngOnInit(): void {
    this.carregarIndicadores();
  }

  carregarIndicadores(): void {
    this.isLoading = true;
    this.dashboardService.getStats().subscribe({
      next: (stats) => {
        // CORREÇÃO: Atribui os valores do objeto de resposta
        this.perguntasHojeCount = stats.perguntasHojeCount;
        this.pendenciasCount = stats.pendenciasCount;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar indicadores do dashboard:', err);
        this.isLoading = false;
        // Zera os contadores em caso de erro
        this.perguntasHojeCount = 0;
        this.pendenciasCount = 0;
      }
    });
  }

  irParaRelatorios(): void {
    this.router.navigate(['/relatorio']);
  }

  irParaPendencias(): void {
    this.router.navigate(['/pendencia']);
  }
}
