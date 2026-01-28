import { Component, inject } from '@angular/core';
import Swal from 'sweetalert2';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'shared-logout-button',
  template: `<button class="btn btn-logout" (click)="logout()"><i class="bi bi-box-arrow-right"></i> Cerrar sesión</button>`,
  styles: ``
})
export class LogoutButtonComponent {
  private authService = inject(AuthService);

  logout() {
    Swal.fire({
      icon:'question',
      title:'¿Cerrar sesión?',
      html:'La sesión actual se terminará y el sistema se cerrará, <b>¿Desea confirmar?</b>',
      showCancelButton:true,
      cancelButtonText:'Cancelar',
      confirmButtonText:'Continuar',
      cancelButtonColor:'#6A5ACD',
      confirmButtonColor:'#32215C'
    }).then((result) => {
      if(result.isConfirmed) {
        this.authService.logout();
      }
    })
  }
}
