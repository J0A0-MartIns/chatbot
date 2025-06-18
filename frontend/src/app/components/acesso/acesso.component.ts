import {Component, OnInit} from '@angular/core';
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {PerfilAcesso} from "../../models/perfil.model";
import {PerfilAcessoService} from "../../services/perfil.service";

@Component({
  selector: 'app-acessos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './acesso.component.html',
  styleUrls: ['./acesso.component.css']
})
export class AcessoComponent implements OnInit {
  perfis: PerfilAcesso[] = [];
  novoPerfil: PerfilAcesso = {
    nome: '',
    permissoes: {
      acessaGerirUsuarios: false,
      acessaDashboard: false,
      acessaBase: false,
      acessaChat: false
    }
  };
  editIndex: number | null = null;
  modalAberto: boolean = false;
  openActionIndex: number | null = null;

  constructor(private servicoPerfil: PerfilAcessoService) {}

  ngOnInit() {
    this.perfis = this.servicoPerfil.obterPerfis();
  }

  salvarPerfil() {
    if (this.editIndex === null) {
      this.servicoPerfil.adicionarPerfil(this.novoPerfil);
    } else {
      this.servicoPerfil.atualizarPerfil(this.editIndex, this.novoPerfil);
    }
    this.recarregarPerfis();
  }

  excluirPerfil(index: number) {
    if (confirm('Deseja excluir este perfil?')) {
      this.servicoPerfil.excluirPerfil(index);
      this.recarregarPerfis();
    }
  }

  cancelar() {
    this.editIndex = null;
    this.novoPerfil = {
      nome: '',
      permissoes: {
        acessaGerirUsuarios: false,
        acessaDashboard: false,
        acessaBase: false,
        acessaChat: false
      }
    };
  }

  private recarregarPerfis() {
    this.perfis = this.servicoPerfil.obterPerfis();
    this.cancelar();
  }

  abrirModal() {
    this.modalAberto = true;
  }

  fecharModal() {
    this.modalAberto = false;
    this.cancelar(); // limpa o formulário
  }

  editarPerfil(index: number) {
    this.novoPerfil = { ...this.perfis[index] };
    this.editIndex = index;
    this.modalAberto = true;
  }

  toggleActionSelect(index: number) {
    if (this.openActionIndex === index) {
      this.openActionIndex = null;
    } else {
      this.openActionIndex = index;
    }
  }
}

