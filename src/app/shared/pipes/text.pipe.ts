import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'text'
})
export class TextPipe implements PipeTransform {

  transform(value: string): string {
    if(value !== undefined) {
      if(value.includes('.')) {
        return `${value}`;
      } else {
        return `${value.substring(0, value.length - 2)}.`
      }
    }
    return '';
  }

}
