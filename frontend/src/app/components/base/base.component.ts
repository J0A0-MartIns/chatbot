import { Component, HostListener } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { CommonModule, NgClass, NgForOf, NgIf } from "@angular/common";

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
  arquivos?: Arquivo[];
  ativo: boolean;
}

@Component({
  selector: 'app-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.css'],
  imports: [
    CommonModule,
    NgIf,
    NgForOf,
    FormsModule,
  ],
  standalone: true
})
export class BaseComponent {
  docs: Documento[] = [];
  newDoc: Documento = this.resetNewDoc();
  newPalavraChave: string = '';
  selectedFile: File | null = null;
  editIndex: number | null = null;
  showModal: boolean = false;
  actionMenuOpen: number | null = null;
  activeMenuIndex: number | null = null;
  termoBuscaTemp: string = '';
  filtroNome: string = '';

  ngOnInit(): void {
    this.loadFromLocalStorage();
  }

  loadFromLocalStorage() {
    const stored = localStorage.getItem('baseConhecimento');
    this.docs = stored ? JSON.parse(stored) : [];
  }

  saveToLocalStorage() {
    localStorage.setItem('baseConhecimento', JSON.stringify(this.docs));
  }

  aplicarFiltro() {
    this.filtroNome = this.termoBuscaTemp.trim().toLowerCase();
  }

  docsFiltrados(): Documento[] {
    if (!this.filtroNome) return this.docs;
    return this.docs.filter(doc =>
        doc.nome.toLowerCase().includes(this.filtroNome)
    );
  }

  openModal(isEdit: boolean = false) {
    this.showModal = true;
    if (!isEdit) {
      this.newDoc = this.resetNewDoc();
      this.editIndex = null;
    }
  }

  closeModal() {
    this.showModal = false;
  }

  resetNewDoc(): Documento {
    return {
      nome: '',
      tema: '',
      microtema: '',
      palavrasChave: [],
      conteudo: '',
      arquivos: [],
      ativo: true
    };
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
    if (file) {
      this.selectedFile = file;
    }
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

  addOrUpdateDoc() {
    if (!this.newDoc.nome || !this.newDoc.conteudo) return;

    if (this.editIndex === null) {
      this.docs.push({ ...this.newDoc });
    } else {
      this.docs[this.editIndex] = { ...this.newDoc };
      this.editIndex = null;
    }
    this.saveToLocalStorage();
    this.closeModal();
    this.resetForm();
  }

  resetForm() {
    this.newDoc = this.resetNewDoc();
    this.newPalavraChave = '';
  }

  editDoc(index: number) {
    this.editIndex = index;
    this.newDoc = JSON.parse(JSON.stringify(this.docs[index]));
    this.actionMenuOpen = null;
    this.openModal(true);
  }

  cancelEdit() {
    this.newDoc = this.resetNewDoc();
    this.editIndex = null;
    this.closeModal();
  }

  deleteDoc(index: number) {
    this.docs.splice(index, 1);
    this.saveToLocalStorage();
    if (this.editIndex === index) {
      this.cancelEdit();
    }
    this.actionMenuOpen = null;
  }

  toggleAtivo(index: number) {
    this.docs[index].ativo = !this.docs[index].ativo;
    this.saveToLocalStorage();
    this.actionMenuOpen = null;
  }

  toggleActionMenu(index: number): void {
    this.activeMenuIndex = this.activeMenuIndex === index ? null : index;
  }

  @HostListener('document:click', ['$event'])
  clickout(event: any) {
    if (!event.target.closest('.actions-menu')) {
      this.actionMenuOpen = null;
    }
  }
}
