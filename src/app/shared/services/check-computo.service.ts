import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CheckComputoService {

  public inicio_c:string = '';

  public cierre_c:string = '';

  checkInicioComputo() {
    return localStorage.getItem('inicioValidacion')!;
  }

  checkCierreComputo() {
    return localStorage.getItem('cierreValidacion')!;
  }

  updtInicioComputo() {
    localStorage.setItem('inicioValidacion','true');
  }

  updtCierreComputo() {
    localStorage.setItem('cierreValidacion','true');
  }
}
