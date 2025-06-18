import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  pendenciasCount = 0;
  perguntasHojeCount = 0;

  constructor(private router: Router) {}

  ngOnInit() {
    this.carregarPendencias();
    this.carregarPerguntasHoje();
  }

  carregarPendencias() {
    const pendencias = JSON.parse(localStorage.getItem('pendenciasChatbot') || '[]');
    this.pendenciasCount = pendencias.length;
  }

  carregarPerguntasHoje() {
    const consultas = JSON.parse(localStorage.getItem('consultasChatbot') || '[]');
    const hoje = new Date();
    const hojeStr = hoje.toISOString().split('T')[0];

    this.perguntasHojeCount = consultas.filter((consulta: any) => {
      if (!consulta.dataHora) return false;
      const dataConsulta = consulta.dataHora.split('T')[0];
      return dataConsulta === hojeStr;
    }).length;
  }

  irParaRelatorios() {
    this.router.navigate(['/relatorio']);
  }

  irParaPendencias() {
    this.router.navigate(['/pendencias']);
  }
}
