import { Component, OnInit, OnDestroy } from '@angular/core';
import { UsuarioService } from '../../../services/usuario.service';
import { Usuario } from '../../../models/usuario.model';
import { BusquedasService } from '../../../services/busquedas.service';
import Swal from 'sweetalert2';
import { ModalImagenService } from '../../../services/modal-imagen.service';
import { delay } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: []
})
export class UsuariosComponent implements OnInit, OnDestroy {

  public totalUsuarios = 0;
  public usuarios: Usuario[] = [];
  public usuariosTemp: Usuario[] = [];
  public imgSubs: Subscription;
  public desde = 0;
  public cargando = true;

  constructor(
    private usuarioService: UsuarioService,
    private busquedasService: BusquedasService,
    private modalImagenService: ModalImagenService
  ) { }

  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  ngOnInit(): void {
    this.cargarUsuarios();
    this.imgSubs = this.modalImagenService.nuevaImagen
    .pipe(delay(100))
    .subscribe(img => this.cargarUsuarios());
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
    this.busquedasService.buscar('usuarios', termino).subscribe((resultados: Usuario[]) => {
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
  }

  cambiarRole(usuario: Usuario) {
    this.usuarioService.guardarUsuario(usuario).subscribe(resp => {
      console.log(resp);
    });
  }

  abrirModal(usuario: Usuario) {
    console.log(usuario);
    this.modalImagenService.abrirModal('usuarios', usuario.uid, usuario.img);
  }

}
