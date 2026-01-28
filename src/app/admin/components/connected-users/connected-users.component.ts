import { Component, inject, OnInit, signal } from '@angular/core';
import { Catalogo } from '../../../main/interfaces/catalogo.inteface';
import { VerificaService } from '../../../auth/services/verifica.service';
import { AdminService } from '../../services/admin.service';
import Swal from 'sweetalert2';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-connected-users',
  templateUrl: './connected-users.component.html',
  styles: ``
})
export class ConnectedUsersComponent implements OnInit {
  private verifyService = inject(VerificaService);
  private adminService = inject(AdminService);

  public lista_usuarios = signal<string[]>([]);

  ngOnInit(): void {
    this.getListaUsuarios();
  }

  getListaUsuarios = ():void => {
    Swal.fire({
      title:'Espere un momento',
      text:'Cargando lista de usuarios conectados...',
      allowEscapeKey:false,
      allowOutsideClick:false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    forkJoin({
      verify: this.verifyService.checkAuthentication(),
      res: this.adminService.getUsuariosConectados()
    }).subscribe(({verify, res}) => {
      if(!verify) return;
      Swal.close();
      this.lista_usuarios.set(res.datos as string[]);
    })
  }
}
