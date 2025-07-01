import { Component, OnInit } from '@angular/core';
import { ChatService, PerguntaPayload, FeedbackPayload } from '../../services/chat.service';
import { TemaService } from '../../services/tema.service';
import { SubtemaService } from '../../services/subtema.service';
import { Tema } from '../../models/tema.model';
import { Subtema } from '../../models/subtema.model';
import { Documento } from '../../models/documento.model';
import {NgForOf, NgIf} from "@angular/common";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  imports: [
    NgIf,
    FormsModule,
    NgForOf
  ],
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  idTemaSelecionado: number | null = null;
  idSubtemaSelecionado: number | null = null;
  pergunta = '';

  temasDisponiveis: Tema[] = [];
  subtemasDisponiveis: Subtema[] = [];

  solucoesEncontradas: Documento[] = [];
  respostaGenerica = '';
  idAtendimentoAtual: number | null = null;
  isLoading = false;
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
    this.temaService.getTemas().subscribe(data => this.temasDisponiveis = data);
  }

  onTemaChange(): void {
    this.idSubtemaSelecionado = null;
    this.subtemasDisponiveis = [];
    if (this.idTemaSelecionado) {
      this.subtemaService.getSubtemasPorTema(this.idTemaSelecionado).subscribe(data => this.subtemasDisponiveis = data);
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
        if (res.encontrado) {
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