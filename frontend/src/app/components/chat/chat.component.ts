import { Component, OnInit } from '@angular/core';
import { ChatService, PerguntaPayload, FeedbackPayload } from '../../services/chat.service';
import { TemaService } from '../../services/tema.service';
import { SubtemaService } from '../../services/subtema.service';
import { Tema } from '../../models/tema.model';
import { Subtema } from '../../models/subtema.model';
import { Documento } from '../../models/documento.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  // Estado do formulário de pergunta
  idTemaSelecionado: number | null = null;
  idSubtemaSelecionado: number | null = null;
  pergunta = '';

  // Dados para os menus de seleção
  temasDisponiveis: Tema[] = [];
  subtemasDisponiveis: Subtema[] = [];

  // Estado da conversa e da UI
  isLoading = false;
  solucoesEncontradas: Documento[] = [];
  respostaGenerica = '';
  idAtendimentoAtual: number | null = null;
  respostaEncontrada: boolean | null = null;
  etapaFeedback: 'inicio' | 'comentario' | 'finalizado' = 'inicio';
  feedbackComentario = '';

  constructor(
      private chatService: ChatService,
      private temaService: TemaService,
      private subtemaService: SubtemaService
  ) {}

  ngOnInit(): void {
    this.carregarTemas();
  }

  carregarTemas(): void {
    this.temaService.getTemas().subscribe({
      next: (data) => this.temasDisponiveis = data,
      error: (err) => console.error('ERRO AO CARREGAR TEMAS:', err)
    });
  }

  onTemaChange(): void {
    this.idSubtemaSelecionado = null;
    this.subtemasDisponiveis = [];
    if (this.idTemaSelecionado) {
      this.subtemaService.getSubtemasPorTema(this.idTemaSelecionado).subscribe({
        next: (data) => this.subtemasDisponiveis = data,
        error: (err) => console.error('ERRO AO CARREGAR SUBTEMAS:', err)
      });
    }
  }

  enviarPergunta(): void {
    if (!this.pergunta.trim() || !this.idSubtemaSelecionado) {
      alert('Por favor, selecione tema, subtema e digite sua pergunta.');
      return;
    }
    this.isLoading = true;
    this.resetarEstadoConversa();

    const payload: PerguntaPayload = {
      pergunta: this.pergunta,
      id_subtema: this.idSubtemaSelecionado
    };

    this.chatService.perguntar(payload).subscribe({
      next: (res) => {
        this.idAtendimentoAtual = res.id_atendimento;
        this.respostaEncontrada = res.encontrado;
        if (res.encontrado && res.solucoes.length > 0) {
          this.solucoesEncontradas = res.solucoes;
        } else {
          this.respostaGenerica = 'Desculpe, não encontrei uma resposta para sua pergunta neste subtema. Deseja que eu registe a sua dúvida como uma sugestão?';
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        this.respostaGenerica = 'Ocorreu um erro ao processar sua pergunta. Tente novamente mais tarde.';
        console.error("ERRO AO PERGUNTAR:", err);
      }
    });
  }

  avaliar(foiUtil: boolean): void {
    if (!this.idAtendimentoAtual) return;
    if (foiUtil) {
      this.chatService.enviarFeedback({ id_atendimento: this.idAtendimentoAtual, avaliacao: true })
          .subscribe(() => this.etapaFeedback = 'finalizado');
    } else {
      this.etapaFeedback = 'comentario';
    }
  }

  enviarFeedbackNegativo(): void {
    if (!this.idAtendimentoAtual) return;
    const payload: FeedbackPayload = {
      id_atendimento: this.idAtendimentoAtual,
      avaliacao: false,
      comentario: this.feedbackComentario
    };
    this.chatService.enviarFeedback(payload).subscribe(() => this.etapaFeedback = 'finalizado');
  }

  enviarComoSugestao(): void {
    if (!this.idAtendimentoAtual) return;
    this.chatService.criarPendenciaDireta(this.idAtendimentoAtual).subscribe(() => {
      this.etapaFeedback = 'finalizado';
      this.respostaGenerica = 'Obrigado! A sua dúvida foi enviada como uma sugestão para a nossa equipa.';
    });
  }

  private resetarEstadoConversa(): void {
    this.solucoesEncontradas = [];
    this.respostaGenerica = '';
    this.idAtendimentoAtual = null;
    this.respostaEncontrada = null;
    this.etapaFeedback = 'inicio';
    this.feedbackComentario = '';
  }
}
