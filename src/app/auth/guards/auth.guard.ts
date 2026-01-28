
import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { VerificaService } from "../services/verifica.service";
import { tap } from "rxjs";

export const AuthGuard:CanActivateFn = (route, state) => {
  const router = inject(Router);
  const verificaService = inject(VerificaService);

  return verificaService.checkAuthentication()
  .pipe(
    tap(isAuthenticated => {
      if(!isAuthenticated)  {
        router.navigateByUrl('auth');
        return false;
      }
      return true;
    })
  )
}



