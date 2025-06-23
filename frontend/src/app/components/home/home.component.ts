import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  resumo: any;

  constructor(private dashService: DashboardService) {}

  ngOnInit() {
    this.dashService.resumo().subscribe((res) => {
      this.resumo = res;
    });
  }
}
