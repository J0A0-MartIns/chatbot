import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-alerta',
  templateUrl: './alerta.component.html',
  styleUrls: ['./alerta.component.css']
})
export class AlertModalComponent {
  @Input() titulo = 'Atenção';
  @Input() mensagem = 'Sessão encerrada. Faça login novamente.';
  @Output() close = new EventEmitter<void>();

  onClose() {
    this.close.emit();
  }
}
