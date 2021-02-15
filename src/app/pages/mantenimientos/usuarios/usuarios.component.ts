import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../../services/usuario.service';
import { Usuario } from '../../../models/usuario.model';
import { BusquedasService } from '../../../services/busquedas.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: []
})
export class UsuariosComponent implements OnInit {

  public totalUsuarios = 0;
  public usuarios: Usuario[] = [];
  public usuariosTemp: Usuario[] = [];
  public desde = 0;
  public cargando = true;

  constructor(
    private usuarioService: UsuarioService,
    private busquedasService: BusquedasService
  ) { }

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    this.cargando = true;
    this.usuarioService.cargarUsuarios(this.desde).subscribe(({ total, usuarios }) => {
      this.totalUsuarios = total;
      this.usuarios = usuarios;
      this.usuariosTemp = usuarios;
      this.cargando = false;
    });
  }

  cambiarPagina(valor: number): void {
    this.desde += valor;
    if (this.desde < 0) {
      this.desde = 0;
    } else if (this.desde >= this.totalUsuarios) {
      this.desde -= valor;
    }
    this.cargarUsuarios();
  }

  buscar(termino: string): Usuario[] {
    if (termino.length === 0) {
      return this.usuarios = this.usuariosTemp;
    }
    this.busquedasService.buscar('usuarios', termino).subscribe(resultados => {
      this.usuarios = resultados;
    });
  }

  eliminarUsuario(usuario: Usuario) {
    if (usuario.uid === this.usuarioService.uid) {
      return Swal.fire('Error', 'No puede borrarse a si mismo', 'error');
    }
    Swal.fire({
      title: '¿Borrar usuario?',
      text: `Está a punto de eliminar a ${usuario.nombre}.`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminarlo'
    }).then((result) => {
      if (result.value) {
        this.usuarioService.eliminarUsuario(usuario).subscribe(resp => {
          this.cargarUsuarios();
          Swal.fire(
            'Usuario eliminado',
            `${usuario.nombre} fue eliminado correctamente.`,
            'success'
          );
        });
      }
    });
    console.log(usuario);
  }

}