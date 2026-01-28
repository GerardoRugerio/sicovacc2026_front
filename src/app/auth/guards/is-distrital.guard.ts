import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import Swal from 'sweetalert2';

export const generalGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const rol = authService.rol();

  switch (rol) {
    case 1:
      if (route.url[0].path !== 'distrital') {
        message();
        return false;
      }
      return true;
    case 2:
      if (route.url[0].path !== 'distrital') {
        message();
        return false;
      }
      return true;
    case 3:
      if (route.url[0].path !== 'central') {
        message();
        return false;
      }
      return true;
    case 4:
      if (route.url[0].path !== 'central') {
        message();
        return false;
      }
      return true;
    case 99:
      if (route.url[0].path !== 'admin') {
        message();
        return false;
      }
      return true;
  }
  return true;
};

const message = ():void => {
  Swal.fire({
    html:`
      <img src="assets/shield-quarter.svg" width="120" alt="shield">
      <br>
      <h3>¡No permitido!</h3>
      <span>Actualmente su usuario no está autorizado para acceder a este módulo.</span>
    `,
    confirmButtonText:'Entendido'
  })
};
