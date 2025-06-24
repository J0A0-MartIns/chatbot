import { Component, OnInit } from '@angular/core';
import { ChatService, PerguntaPayload, RespostaChat } from '../../services/chatbot.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html'
})
export class ChatComponent implements OnInit {
  chat = {
    temaId: 0,
    subtemaId: 0,
    pergunta: '',
    resposta: '',
    idAtendimento: 0,
    avaliacao: false
  };

  temasDisponiveis: any[] = [];
  microTemasRelacionados: any[] = [];

  usuarioId: number = 0;

  constructor(private chatService: ChatService) {}

  ngOnInit(): void {
    this.usuarioId = Number(localStorage.getItem('usuarioId') || 0);

    // Aqui você pode chamar um service real para buscar temas do banco, se já existir
    this.carregarTemas();
  }

  carregarTemas(): void {
    // Simulado por enquanto; substitua por chamada real se tiver:
    this.temasDisponiveis = [
      { id: 1, nome: 'Atendimento' },
      { id: 2, nome: 'Financeiro' }
    ];
  }

  onTemaChange(): void {
    this.chat.subtemaId = 0;
    // Aqui também, troque por chamada ao backend real
    if (this.chat.temaId === 1) {
      this.microTemasRelacionados = [
        { id: 10, nome: 'Abertura de chamado' },
        { id: 11, nome: 'Encerramento' }
      ];
    } else if (this.chat.temaId === 2) {
      this.microTemasRelacionados = [
        { id: 20, nome: 'Boletos' },
        { id: 21, nome: 'Reembolso' }
      ];
    } else {
      this.microTemasRelacionados = [];
    }
  }

  enviarPergunta(): void {
    const payload: PerguntaPayload = {
      texto: this.chat.pergunta,
      temaId: this.chat.temaId,
      subtemaId: this.chat.subtemaId,
      usuarioId: this.usuarioId
    };

    this.chatService.perguntar(payload).subscribe((res: RespostaChat) => {
      this.chat.resposta = res.resposta;
      this.chat.idAtendimento = res.id_atendimento;
      this.chat.avaliacao = false;
    });
  }

  avaliar(tipo: 'util' | 'nao-util'): void {
    const avaliacao = tipo === 'util' ? 1 : 0;
    this.chatService.enviarFeedback(this.chat.idAtendimento, avaliacao).subscribe(() => {
      this.chat.avaliacao = true;
    });
  }
}
