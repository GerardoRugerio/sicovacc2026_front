import { inject } from '@angular/core';
import { CanActivateFn} from '@angular/router';
import { VerificaService } from '../services/verifica.service';
import { tap } from 'rxjs';
import Swal from 'sweetalert2';

export const checkVerifyGuard: CanActivateFn = (route, state) => {
  const verificaService = inject(VerificaService);
  return true;
  // Swal.fire({
  //   title: 'Espere un momento',
  //   text: 'Se están cargando los elementos de la página...',
  //   didOpen: () => {
  //     Swal.showLoading();
  //   },
  //   allowOutsideClick: false,
  //   allowEscapeKey: false,
  //   showConfirmButton: false
  // });

  // return verificaService.checkAuthentication()
  // .pipe(
  //   tap(isAuthenticated => {
  //     if(!isAuthenticated) {
  //       return false;
  //     } else {
  //       Swal.close();
  //       return true;
  //     }
  //   })
  // )
};
