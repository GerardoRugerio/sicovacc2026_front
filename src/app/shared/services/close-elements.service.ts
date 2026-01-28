import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CloseElementsService {

  close = () => {
    let control_seguimiento = $('#seguimiento');
    let control_procesos = $('#procesos');
    let btn_seguimiento = $('#btn_seguimiento');
    let btn_procesos = $('#btn_procesos');

    control_seguimiento[0].style.height = '0px';
    control_procesos[0].style.height = '0px';

    if (control_seguimiento[0].clientHeight > 0)
     btn_seguimiento.toggleClass('arrow');
    if (control_procesos[0].clientHeight > 0)
     btn_procesos.toggleClass('arrow');
  }
}
