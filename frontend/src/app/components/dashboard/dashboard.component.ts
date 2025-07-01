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
     standalone: true,
})
export class DashboardComponent implements OnInit {
  perguntasHojeCount = 0;
  pendenciasCount = 0;
  isLoading = true;

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
        this.perguntasHojeCount = stats.perguntasHojeCount;
        this.pendenciasCount = stats.pendenciasCount;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar indicadores do dashboard:', err);
        this.isLoading = false;
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
