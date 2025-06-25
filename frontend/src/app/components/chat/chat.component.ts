import { Component, OnInit } from '@angular/core';
import { ChatService, PerguntaPayload, RespostaChat } from '../../services/chat.service';
import { TemaService } from '../../services/tema.service'; // Assumindo que você terá este serviço
import { SubtemaService } from '../../services/subtema.service'; // e este
import { Tema } from '../../models/tema.model';
import { Subtema } from '../../models/subtema.model';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  // Estado do formulário
  idTemaSelecionado: number | null = null;
  idSubtemaSelecionado: number | null = null;
  pergunta = '';

  // Dados para os dropdowns
  temasDisponiveis: Tema[] = [];
  subtemasDisponiveis: Subtema[] = [];

  // Estado da conversa
  respostaChat = '';
  idAtendimentoAtual: number | null = null;
  feedbackEnviado = false;
  isLoading = false;

  constructor(
      private chatService: ChatService,
      private temaService: TemaService,
      private subtemaService: SubtemaService
  ) {}

  ngOnInit(): void {
    this.carregarTemas();
  }

  carregarTemas(): void {
    this.temaService.getTemas().subscribe(data => this.temasDisponiveis = data);
  }

  onTemaChange(): void {
    this.idSubtemaSelecionado = null;
    this.subtemasDisponiveis = [];
    if (this.idTemaSelecionado) {
      this.subtemaService.getSubtemasPorTema(this.idTemaSelecionado).subscribe(data => {
        this.subtemasDisponiveis = data;
      });
    }
  }

  enviarPergunta(): void {
    if (!this.pergunta || !this.idSubtemaSelecionado) {
      alert('Por favor, selecione tema, subtema e digite sua pergunta.');
      return;
    }
    this.isLoading = true;
    this.respostaChat = '';
    this.feedbackEnviado = false;

    const payload: PerguntaPayload = {
      pergunta: this.pergunta,
      id_subtema: this.idSubtemaSelecionado
    };

    this.chatService.perguntar(payload).subscribe({
      next: (res) => {
        this.respostaChat = res.resposta;
        this.idAtendimentoAtual = res.id_atendimento;
        this.isLoading = false;
      },
      error: (err) => {
        this.respostaChat = 'Ocorreu um erro ao buscar sua resposta. Tente novamente.';
        this.isLoading = false;
      }
    });
  }

  avaliar(foiUtil: boolean): void {
    if (!this.idAtendimentoAtual) return;

    this.chatService.enviarFeedback({
      id_atendimento: this.idAtendimentoAtual,
      avaliacao: foiUtil
    }).subscribe(() => {
      this.feedbackEnviado = true;
    });
  }
}
