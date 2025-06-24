import { Component, OnInit } from '@angular/core';
import { BaseService } from '../../services/base.service';

interface Documento {
  id_documento?: number;
  nome: string;
  tema: string;
  microtema: string;
  conteudo: string;
  palavrasChave: string[];
  arquivos: { nome: string; tipo: string }[];
  ativo: boolean;
}

@Component({
  selector: 'app-base',
  templateUrl: './base.component.html'
})
export class BaseComponent implements OnInit {
  documentos: Documento[] = [];
  termoBuscaTemp = '';
  showModal = false;
  editIndex: number | null = null;
  activeMenuIndex: number | null = null;

  newDoc: Documento = this.criarDocVazio();
  newPalavraChave = '';
  selectedFile: File | null = null;

  constructor(private baseService: BaseService) {}

  ngOnInit(): void {
    this.carregarDocumentos();
  }

  criarDocVazio(): Documento {
    return {
      nome: '',
      tema: '',
      microtema: '',
      conteudo: '',
      palavrasChave: [],
      arquivos: [],
      ativo: true
    };
  }

  carregarDocumentos(): void {
    this.baseService.getDocumentos().subscribe((res) => {
      this.documentos = res;
    });
  }

  docsFiltrados(): Documento[] {
    return this.documentos.filter(doc =>
        doc.nome.toLowerCase().includes(this.termoBuscaTemp.toLowerCase())
    );
  }

  aplicarFiltro(): void {
    // apenas atualiza a tela com docsFiltrados()
  }

  openModal(): void {
    this.newDoc = this.criarDocVazio();
    this.editIndex = null;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.editIndex = null;
  }

  toggleActionMenu(index: number): void {
    this.activeMenuIndex = this.activeMenuIndex === index ? null : index;
  }

  editDoc(index: number): void {
    this.newDoc = JSON.parse(JSON.stringify(this.documentos[index]));
    this.editIndex = index;
    this.showModal = true;
  }

  cancelEdit(): void {
    this.closeModal();
  }

  addOrUpdateDoc(): void {
    if (this.editIndex !== null && this.newDoc.id_documento) {
      this.baseService.updateDocumento(this.newDoc.id_documento, this.newDoc).subscribe(() => {
        this.carregarDocumentos();
        this.closeModal();
      });
    } else {
      this.baseService.createDocumento(this.newDoc).subscribe(() => {
        this.carregarDocumentos();
        this.closeModal();
      });
    }
  }

  deleteDoc(index: number): void {
    const id = this.documentos[index].id_documento!;
    this.baseService.deleteDocumento(id).subscribe(() => {
      this.documentos.splice(index, 1);
    });
  }

  toggleAtivo(index: number): void {
    const doc = this.documentos[index];
    const novoEstado = !doc.ativo;
    this.baseService.ativarOuDesativar(doc.id_documento!, novoEstado).subscribe(() => {
      doc.ativo = novoEstado;
    });
  }

  addPalavraChave(): void {
    if (this.newPalavraChave && !this.newDoc.palavrasChave.includes(this.newPalavraChave)) {
      this.newDoc.palavrasChave.push(this.newPalavraChave);
      this.newPalavraChave = '';
    }
  }

  removePalavraChave(index: number): void {
    this.newDoc.palavrasChave.splice(index, 1);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  uploadFile(): void {
    if (this.selectedFile) {
      this.baseService.uploadArquivo(this.selectedFile).subscribe((res) => {
        this.newDoc.arquivos.push({ nome: res.nome, tipo: res.tipo });
        this.selectedFile = null;
      });
    }
  }

  removeArquivo(index: number): void {
    this.newDoc.arquivos.splice(index, 1);
  }
}
