import { Component } from '@angular/core';
import { ChatbotService } from '../../services/chatbot.service';

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html'
})
export class ChatbotComponent {
  pergunta = '';
  resposta = '';
  idAtendimento = 0;

  constructor(private chatbot: ChatbotService) {}

  enviar() {
    this.chatbot.perguntar(this.pergunta).subscribe((res) => {
      this.resposta = res.resposta || 'Não encontrei uma resposta.';
      this.idAtendimento = res.atendimento_id;
    });
  }

  avaliar(satisfatorio: boolean) {
    this.chatbot.enviarFeedback(this.idAtendimento, satisfatorio).subscribe(() => {
      alert('Avaliação enviada!');
    });
  }
}
