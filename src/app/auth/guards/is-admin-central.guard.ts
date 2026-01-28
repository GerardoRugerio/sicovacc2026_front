import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import Swal from 'sweetalert2';

export const isAdminCentralGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const rol = authService.rol();

  if(rol !== 4) {
    message();
    return false;
  }
  return true;

};

const message = ():void => {
  Swal.fire({
    html:`
    <img src="assets/sield-quarter.svg" alt="shield">
    <br>
    <h3>¡No permitido!</h3>
    <span>El acceso a esta sección solo está permitido para el administrador.</span>
    `,
    confirmButtonText:'Entendido'
  });
}
