import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { VerificaService } from "../services/verifica.service";
import { AuthService } from "../services/auth.service";
import { map, tap } from "rxjs";

export const PublicGuard:CanActivateFn = (route,state) => {
  const authService = inject(AuthService);
  const verificaService = inject(VerificaService);
  const router = inject(Router)
  const rol = authService.rol();

  return verificaService.checkAuthentication()
  .pipe(
    tap(isAuthenticated => {
      if(!isAuthenticated) {
        // authService.clearStorage();
      } else {
        switch(rol) {
          case 1:
            router.navigateByUrl('distrital');
          break;
          case 2:
            router.navigateByUrl('distrital');
          break;
          case 3:
            router.navigateByUrl('central');
          break;
          case 4:
            router.navigateByUrl('central');
          break;
        }
      }
    }),
    map(isAuthenticated => !isAuthenticated),
  )
}

