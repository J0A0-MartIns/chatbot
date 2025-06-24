import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  perguntasHojeCount = 0;
  pendenciasCount = 0;

  constructor(
      private dashboardService: DashboardService,
      private router: Router
  ) {}

  ngOnInit(): void {
    this.carregarIndicadores();
  }

  carregarIndicadores(): void {
    this.dashboardService.getTotalPerguntas().subscribe({
      next: qtd => this.perguntasHojeCount = qtd,
      error: () => this.perguntasHojeCount = 0
    });

    this.dashboardService.getTotalPendencias().subscribe({
      next: qtd => this.pendenciasCount = qtd,
      error: () => this.pendenciasCount = 0
    });
  }

  irParaRelatorios(): void {
    this.router.navigate(['/relatorio']);
  }

  irParaPendencias(): void {
    this.router.navigate(['/pendencia']);
  }
}
