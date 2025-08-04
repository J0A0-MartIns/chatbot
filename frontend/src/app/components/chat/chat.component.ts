import {Component, OnInit} from '@angular/core';
import {ChatService} from '../../services/chat.service';
import {TemaService} from '../../services/tema.service';
import {SubtemaService} from '../../services/subtema.service';
import {Tema} from '../../models/tema.model';
import {Subtema} from '../../models/subtema.model';
import {Documento} from '../../models/documento.model';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {FeedbackPayload, PerguntaPayload, RespostaChat} from "../../models/chat.model";

@Component({
    selector: 'app-chat',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
    idTemaSelecionado: number | null = null;
    idSubtemaSelecionado: number | null = null;
    pergunta = '';

    temasDisponiveis: Tema[] = [];
    subtemasDisponiveis: Subtema[] = [];

    isLoading = false;
    solucoesEncontradas: Documento[] = [];
    respostaDaIA = '';
    idAtendimentoAtual: number | null = null;
    respostaEncontrada: boolean | null = null;
    etapaFeedback: 'inicio' | 'comentario' | 'finalizado' = 'inicio';
    feedbackComentario = '';

    constructor(
        private chatService: ChatService,
        private temaService: TemaService,
        private subtemaService: SubtemaService
    ) {
    }

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
            next: (res: RespostaChat) => {
                this.idAtendimentoAtual = res.id_atendimento;
                this.respostaEncontrada = res.encontrado;
                this.solucoesEncontradas = res.solucoes || [];
                this.respostaDaIA = res.resposta;
                this.isLoading = false;
            },
            error: (err) => {
                this.isLoading = false;
                this.respostaDaIA = 'Ocorreu um erro ao processar sua pergunta. Tente novamente mais tarde.';
                console.error("ERRO AO PERGUNTAR:", err);
            }
        });
    }

    avaliar(foiUtil: boolean): void {
        if (!this.idAtendimentoAtual) return;
        if (foiUtil) {
            this.chatService.enviarFeedback({id_atendimento: this.idAtendimentoAtual, avaliacao: true})
                .subscribe(() => this.etapaFeedback = 'finalizado');
        } else {
            this.etapaFeedback = 'comentario';
        }
    }

    enviarFeedbackNegativo(): void {
        if (!this.idAtendimentoAtual)
            return;
        const primeiraSolucao = this.solucoesEncontradas.length > 0 ? this.solucoesEncontradas[0] : null;
        const payload: FeedbackPayload = {
            id_atendimento: this.idAtendimentoAtual,
            avaliacao: false,
            comentario: this.feedbackComentario,
            tema: primeiraSolucao?.Subtema?.tema?.nome,
            subtema: primeiraSolucao?.Subtema?.nome
        };
        this.chatService.enviarFeedback(payload).subscribe(() => this.etapaFeedback = 'finalizado');
    }

    enviarComoSugestao(): void {
        if (!this.idAtendimentoAtual) return;
        this.chatService.criarPendenciaDireta(this.idAtendimentoAtual).subscribe(() => {
            this.etapaFeedback = 'finalizado';
            this.respostaDaIA = 'Obrigado! A sua dúvida foi enviada para análise.';
        });
    }

    private resetarEstadoConversa(): void {
        this.solucoesEncontradas = [];
        this.respostaDaIA = '';
        this.idAtendimentoAtual = null;
        this.respostaEncontrada = null;
        this.etapaFeedback = 'inicio';
        this.feedbackComentario = '';
    }
}