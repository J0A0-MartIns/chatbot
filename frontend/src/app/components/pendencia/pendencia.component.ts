import { Component, OnInit } from '@angular/core';
import { BaseService, Documento } from '../../services/base.service';
import { PendenciaService, Pendencia } from '../../services/pendencia.service';

@Component({
  selector: 'app-pendencia',
  templateUrl: './pendencia.component.html',
  styleUrls: ['./pendencia.component.css']
})
export class PendenciaComponent implements OnInit {
  pendencias: Pendencia[] = [];
  showModal = false;
  editIndex: number | null = null;

  newDoc: Partial<Documento & { pergunta?: string; palavrasChave: string[]; arquivos: any[] }> = {
    palavrasChave: [],
    arquivos: []
  };
  newPalavraChave = '';
  selectedFile: File | null = null;

  constructor(
      private pendenciaService: PendenciaService,
      private baseService: BaseService
  ) {}

  ngOnInit(): void {
    this.carregarPendencias();
  }

  carregarPendencias(): void {
    this.pendenciaService.listar().subscribe({
      next: (dados) => this.pendencias = dados,
      error: () => alert('Erro ao carregar pendências.')
    });
  }

  formatarData(dataStr: string): string {
    const dt = new Date(dataStr);
    return dt.toLocaleString();
  }

  adicionarPendenciaNaBase(pendencia: Pendencia, index: number): void {
    this.newDoc = {
      nome: '', // pode preencher com título padrão se quiser
      tema: pendencia.tema,
      microtema: pendencia.microtema,
      conteudo: '',
      palavrasChave: [],
      arquivos: [],
      pergunta: pendencia.pergunta
    };
    this.editIndex = index;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.editIndex = null;
    this.newDoc = { palavrasChave: [], arquivos: [] };
    this.newPalavraChave = '';
    this.selectedFile = null;
  }

  addPalavraChave(): void {
    if (this.newPalavraChave.trim() && !this.newDoc.palavrasChave!.includes(this.newPalavraChave.trim())) {
      this.newDoc.palavrasChave!.push(this.newPalavraChave.trim());
      this.newPalavraChave = '';
    }
  }

  removePalavraChave(i: number): void {
    this.newDoc.palavrasChave!.splice(i, 1);
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  uploadFile(): void {
    if (!this.selectedFile) return;

    const formData = new FormData();
    formData.append('arquivo', this.selectedFile);
    this.baseService.uploadArquivo(formData).subscribe({
      next: (resp: any) => {
        if (!this.newDoc.arquivos) this.newDoc.arquivos = [];
        this.newDoc.arquivos.push(resp.file);
        this.selectedFile = null;
      },
      error: () => alert('Erro ao enviar arquivo.')
    });
  }

  removeArquivo(i: number): void {
    this.newDoc.arquivos!.splice(i, 1);
  }

  addOrUpdateDoc(): void {
    if (!this.newDoc.nome || !this.newDoc.conteudo) return;

    // Chama o serviço para criar documento na base de conhecimento
    this.baseService.criar(this.newDoc as Documento).subscribe({
      next: () => {
        alert('Documento adicionado com sucesso!');
        this.excluirPendencia(this.editIndex!);
        this.closeModal();
      },
      error: () => alert('Erro ao adicionar documento.')
    });
  }

  excluirPendencia(index: number): void {
    const pend = this.pendencias[index];
    this.pendenciaService.excluir(pend.id_pendencia!).subscribe({
      next: () => {
        this.pendencias.splice(index, 1);
      },
      error: () => alert('Erro ao excluir pendência.')
    });
  }
}
