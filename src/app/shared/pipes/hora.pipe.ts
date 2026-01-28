import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'hora'
})
export class HoraPipe implements PipeTransform {

  transform(hour:string): string {
    const horas = +hour.split(':')[0], minutos = hour.split(':')[1];
    let hora = horas > 12 ? horas - 12 : (horas == 0 ? 12 : horas);
    return `${hora.toString().padStart(2, '0')}:${minutos} ${+horas >= 12 ? 'P.M.' : 'A.M.'}`
  }

}
