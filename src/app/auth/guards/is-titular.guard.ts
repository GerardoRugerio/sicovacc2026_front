import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import Swal from 'sweetalert2';

export const isTitularGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const rol = authService.rol!;

  return true;
  // if(rol > 1) {
  //   message();
  //   return false;
  // }
};

const message = ():void => {
    Swal.fire({
    icon:'error',
    title:'¡No permtido!',
    text:'El acceso a este módulo solo está permitido para el usuario titular de la dirección distrital.',
    confirmButtonText:'Entendido'
  })
};
