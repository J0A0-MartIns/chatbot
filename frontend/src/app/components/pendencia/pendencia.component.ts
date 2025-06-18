import { Component, HostListener } from '@angular/core';
import { CommonModule, NgClass, NgForOf, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Arquivo {
  nome: string;
  tipo: string;
  conteudo: string;
}

interface Documento {
  nome: string;
  tema?: string;
  microtema?: string;
  palavrasChave: string[];
  conteudo: string;
  pergunta: string;
  arquivos?: Arquivo[];
  ativo: boolean;
}

@Component({
  selector: 'app-pendencia',
  standalone: true,
  imports: [CommonModule, NgIf, NgForOf, FormsModule],
  templateUrl: './pendencia.component.html',
  styleUrls: ['./pendencia.component.css']
})
export class PendenciaComponent {
  pendencias: any[] = [];
  docs: Documento[] = [];
  showModal = false;
  editIndex: number | null = null;
  indexParaRemoverPendencia: number | null = null;

  newDoc: Documento = this.resetNewDoc();
  newPalavraChave: string = '';
  selectedFile: File | null = null;

  ngOnInit() {
    const storedPendencias = localStorage.getItem('pendenciasChatbot');
    this.pendencias = storedPendencias ? JSON.parse(storedPendencias) : [];

    const storedDocs = localStorage.getItem('baseConhecimento');
    this.docs = storedDocs ? JSON.parse(storedDocs) : [];
  }

  resetNewDoc(pergunta: string = ''): Documento {
    return {
      nome: '',
      tema: '',
      microtema: '',
      palavrasChave: [],
      conteudo: '',
      pergunta: pergunta,
      arquivos: [],
      ativo: true
    };
  }

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.resetForm();
  }

  resetForm() {
    this.newDoc = this.resetNewDoc();
    this.newPalavraChave = '';
    this.selectedFile = null;
    this.editIndex = null;
    this.indexParaRemoverPendencia = null;
  }

  formatarData(dataISO?: string): string {
    if (!dataISO) return '-';
    const data = new Date(dataISO);
    if (isNaN(data.getTime())) return '-';
    return data.toLocaleString();
  }

  adicionarPendenciaNaBase(pendencia: any, index: number) {
    this.newDoc = {
      nome: `Resposta para: ${pendencia.pergunta}`,
      tema: pendencia.tema,
      microtema: pendencia.microtema,
      palavrasChave: [],
      conteudo: '',
      arquivos: [],
      ativo: true,
      pergunta: pendencia.pergunta
    };
    this.indexParaRemoverPendencia = index;
    this.showModal = true;
  }

  addOrUpdateDoc() {
    if (!this.newDoc.nome || !this.newDoc.conteudo) return;

    if (this.editIndex === null) {
      this.docs.push({ ...this.newDoc });
    } else {
      this.docs[this.editIndex] = { ...this.newDoc };
    }

    localStorage.setItem('baseConhecimento', JSON.stringify(this.docs));

    if (this.indexParaRemoverPendencia !== null) {
      this.pendencias.splice(this.indexParaRemoverPendencia, 1);
      localStorage.setItem('pendenciasChatbot', JSON.stringify(this.pendencias));
      this.indexParaRemoverPendencia = null;
    }

    this.closeModal();
  }

  addPalavraChave() {
    if (this.newPalavraChave.trim()) {
      this.newDoc.palavrasChave.push(this.newPalavraChave.toLowerCase().trim());
      this.newPalavraChave = '';
    }
  }

  removePalavraChave(index: number) {
    this.newDoc.palavrasChave.splice(index, 1);
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) this.selectedFile = file;
  }

  uploadFile() {
    if (!this.selectedFile) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      const tipo = this.selectedFile!.name.split('.').pop() || 'desconhecido';
      const arquivo: Arquivo = {
        nome: this.selectedFile!.name,
        tipo: tipo.toUpperCase(),
        conteudo: base64
      };
      this.newDoc.arquivos?.push(arquivo);
      this.selectedFile = null;
    };
    reader.readAsDataURL(this.selectedFile);
  }

  removeArquivo(index: number) {
    this.newDoc.arquivos?.splice(index, 1);
  }

  excluirPendencia(index: number) {
    this.pendencias.splice(index, 1);
    localStorage.setItem('pendenciasChatbot', JSON.stringify(this.pendencias));
  }

  @HostListener('document:click', ['$event'])
  clickout(event: any) {
    if (!event.target.closest('.actions-menu')) {
    }
  }
}
