import { Injectable } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ValidatorsService {

  public isValidField(form:FormGroup, field:string) {
    return form.controls[field].errors && form.controls[field].touched;
  }

  public getFieldError(form:FormGroup, field:string) {
    const errors = form.get(field)?.errors || {};

    for(const key of Object.keys(errors)) {
      switch(key) {
        case 'required':
          return 'Campo obligatorio';
        case 'minlength':
          return `El mínimo de carácteres requeridos es de: ${errors['minlength'].requiredLength}`;
        case 'maxlength':
          return `El máximo de carácteres permitidos es de: ${errors['maxLength'].requiredLength}`;
        case 'max':
          return `Valor máximo: ${errors['max'].max}.`;
        case 'min':
          return `Valor mínimo: ${errors['min'].min}`;
      }
    }
    return '';
  }

  public getFieldLengthError(form:FormGroup,field:string, maxlength:number = 0) {
    const errors = form.get(field)?.errors || {};

    for(const key of Object.keys(errors)) {
      switch(key) {
        case 'required':
          return 'Campo obligatorio'
        case 'maxlength':
          return `Límite excedido: ${form.get(field)?.value.toString().length}/${maxlength}`;
      }
    }
    return `${form.get(field)?.value.toString().length}/${maxlength}`;
  }

  public isValidVotosField(form:FormGroup,field:string, position:string,form_field:string) {
    return form.get(field)?.get(position)?.get(form_field)?.errors && form.get(field)?.get(position)?.get(form_field)?.touched || false;
  }

  public getFieldVotosErrors(form:FormGroup,field:string, position:string,form_field:string) {
   const errors = form.get(field)?.get(position)?.get(form_field)?.errors || {};

   for (const key of Object.keys(errors)) {
    switch(key) {
      case 'required':
        return 'Obligatorio';
    }
   }
   return '';
  }
}
