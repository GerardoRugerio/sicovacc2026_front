import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

import Swal from 'sweetalert2';

export const checkInicioComputoGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const inicioValidacion = authService.inicioValidacion();

  if(inicioValidacion) {
    return true;
  } else {
    Swal.fire({
      icon:'error',
      title:'¡No permitido!',
      html:`Actualmente no se ha realizado el inicio de la validación por lo tanto, <b>¡no se permite acceder a esta sección!</b>`,
      allowEscapeKey:false,
      allowOutsideClick:false,
      confirmButtonText:'Aceptar'
    });
    return false;
  }
};

