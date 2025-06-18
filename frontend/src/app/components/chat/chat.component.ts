import { Component, OnInit } from '@angular/core';
import { ChatMessage } from '../../models/chat-message.model';
import { DataService } from '../../services/data.service';
import { Data } from '../../models/data.model';
import { FormsModule } from "@angular/forms";
import { NgForOf, NgIf } from "@angular/common";

@Component({
  selector: 'app-chatbot',
  styleUrls: ['./chat.component.css'],
  templateUrl: './chat.component.html',
  imports: [
    FormsModule,
    NgIf,
    NgForOf
  ]
})
export class ChatComponent implements OnInit {
  temasDisponiveis: string[] = [];
  microTemasMap: { [key: string]: string[] } = {};
  microTemasRelacionados: string[] = [];
  perguntaOriginal: string = '';

  chat: ChatMessage = {
    tema: '',
    microTema: '',
    pergunta: '',
    resposta: '',
    avaliacao: undefined
  };

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    const baseConhecimento = localStorage.getItem('baseConhecimento');
    const docs = baseConhecimento ? JSON.parse(baseConhecimento) : [];

    const temasSet = new Set<string>();
    const microTemasMap: { [key: string]: Set<string> } = {};

    for (const doc of docs) {
      const tema = doc.tema?.trim();
      const microtema = doc.microtema?.trim();

      if (!tema) continue;

      temasSet.add(tema);

      if (!microTemasMap[tema]) {
        microTemasMap[tema] = new Set();
      }

      if (microtema) {
        microTemasMap[tema].add(microtema);
      }
    }

    this.temasDisponiveis = Array.from(temasSet);
    this.microTemasMap = {};
    for (const tema of Object.keys(microTemasMap)) {
      this.microTemasMap[tema] = Array.from(microTemasMap[tema]);
    }
  }

  onTemaChange() {
    this.microTemasRelacionados = this.microTemasMap[this.chat.tema] || [];
    this.chat.microTema = '';
  }

  enviarPergunta() {
    console.log('Tema:', this.chat.tema);
    console.log('Microtema:', this.chat.microTema);
    console.log('Pergunta:', this.chat.pergunta);
    if (!this.chat.tema.trim() || !this.chat.microTema.trim() || !this.chat.pergunta.trim()) {
      alert('Por favor, preencha todos os campos antes de enviar a pergunta.');
      return;
    }

    const baseConhecimento = localStorage.getItem('baseConhecimento');
    const docs = baseConhecimento ? JSON.parse(baseConhecimento) : [];

    const docsFiltrados = docs.filter((doc: any) =>
        doc.tema?.toLowerCase().trim() === this.chat.tema.toLowerCase().trim() &&
        doc.microtema?.toLowerCase().trim() === this.chat.microTema.toLowerCase().trim()
    );

    let resultado = null;
    const pergunta = this.chat.pergunta.toLowerCase().trim();

    for (const doc of docsFiltrados) {
      const palavras = Array.isArray(doc.palavrasChave) ? doc.palavrasChave : [];
      for (const palavra of palavras) {
        console.log(`Verificando se a pergunta "${pergunta}" inclui a palavra-chave "${palavra.toLowerCase().trim()}"`);
        if (pergunta.includes(palavra.toLowerCase().trim())) {
          resultado = doc;
          break;
        }
      }
      if (resultado) break;
    }

    this.chat.resposta = resultado ? resultado.conteudo : 'Nenhuma resposta encontrada para sua pergunta.';
    this.chat.avaliacao = undefined;
    this.chat.dataHora = new Date().toISOString();
    this.chat.palavraChave = resultado?.palavrasChave;

    const novaEntrada: ChatMessage = { ...this.chat };

    const historico = JSON.parse(localStorage.getItem('consultasChatbot') || '[]');
    historico.push(novaEntrada);
    localStorage.setItem('consultasChatbot', JSON.stringify(historico));

    this.chat.pergunta = '';
  }

  avaliar(valor: 'util' | 'nao-util') {
    this.chat.avaliacao = valor;

    const consultas = JSON.parse(localStorage.getItem('consultasChatbot') || '[]');
    for (let i = consultas.length - 1; i >= 0; i--) {
      if (consultas[i].pergunta === this.perguntaOriginal && consultas[i].dataHora === this.chat.dataHora) {
        consultas[i].avaliacao = valor;
        break;
      }
    }
    localStorage.setItem('consultasChatbot', JSON.stringify(consultas));

    if (valor === 'nao-util') {
      const feedbacks = JSON.parse(localStorage.getItem('feedbackNegativo') || '[]');
      feedbacks.push({
        pergunta: this.perguntaOriginal,
        data: this.chat.dataHora || new Date().toISOString()
      });
      localStorage.setItem('feedbackNegativo', JSON.stringify(feedbacks));

      if (this.chat.resposta === 'Nenhuma resposta encontrada para sua pergunta.') {
        const confirmar = confirm('Não encontramos uma resposta para sua pergunta. Deseja enviá-la para análise posterior?');
        if (confirmar) {
          const pendencias = JSON.parse(localStorage.getItem('pendenciasChatbot') || '[]');
          const pendencia = {
            tema: this.chat.tema,
            microtema: this.chat.microTema,
            pergunta: this.perguntaOriginal, //
            avaliacao: valor,
            data: this.chat.dataHora || new Date().toISOString()
          };
          pendencias.push(pendencia);
          localStorage.setItem('pendenciasChatbot', JSON.stringify(pendencias));
          alert('Sua pergunta foi encaminhada para análise.');
        } else {
          alert('Tudo bem! Sua pergunta não foi enviada.');
        }
      }
    }

    // Agora sim, limpa a pergunta
    this.chat.pergunta = '';
    this.perguntaOriginal = '';
  }



}
