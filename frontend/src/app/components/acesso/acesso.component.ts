import { Component, OnInit } from '@angular/core';
import { PerfilService, Perfil } from '../../services/perfil.service';

@Component({
  selector: 'app-acesso',
  templateUrl: './acesso.component.html',
  styleUrls: ['./acesso.component.css']
})
export class AcessoComponent implements OnInit {
  perfis: Perfil[] = [];
  novoPerfil: Perfil = this.resetPerfil();
  editando = false;

  constructor(private perfilService: PerfilService) {}

  ngOnInit() {
    this.carregarPerfis();
  }

  carregarPerfis() {
    this.perfilService.listar().subscribe(res => this.perfis = res);
  }

  salvar() {
    if (this.editando && this.novoPerfil.id) {
      this.perfilService.atualizar(this.novoPerfil.id, this.novoPerfil).subscribe(() => {
        this.cancelar();
        this.carregarPerfis();
      });
    } else {
      this.perfilService.criar(this.novoPerfil).subscribe(() => {
        this.cancelar();
        this.carregarPerfis();
      });
    }
  }

  editar(perfil: Perfil) {
    this.novoPerfil = { ...perfil };
    this.editando = true;
  }

  excluir(id?: number) {
    if (id && confirm('Deseja excluir este perfil?')) {
      this.perfilService.excluir(id).subscribe(() => this.carregarPerfis());
    }
  }

  cancelar() {
    this.novoPerfil = this.resetPerfil();
    this.editando = false;
  }

  resetPerfil(): Perfil {
    return {
      nome: '',
      acessaChat: false,
      acessaDashboard: false,
      acessaBase: false,
      acessaGerirUsuarios: false
    };
  }
}
