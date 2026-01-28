import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Acta } from '../../../main/interfaces/captura_resultados_actas.interface';

@Component({
  selector: 'deoeyg-actas-table',
  templateUrl: './actas-table.component.html',
  styles: ``
})
export class ActasTableComponent {

  @Input()
  public lista_actas:Acta[] | undefined;

  @Output()
  public id_acta = new EventEmitter<number>();

  emitIdActa = (id_acta:number):void => {
    this.id_acta.emit(id_acta);
  }
}
