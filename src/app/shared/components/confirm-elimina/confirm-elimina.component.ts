import { Component, EventEmitter, inject, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { ValidatorsService } from '../../services/validators.service';

declare var $:any;

@Component({
  selector: 'shared-confirm-elimina',
  templateUrl: './confirm-elimina.component.html',
  styleUrl: './confirm-elimina.component.css'
})
export class ConfirmEliminaComponent implements OnChanges {
  private fb = inject(FormBuilder);
  private validatorsService = inject(ValidatorsService);

  public confirmForm = this.fb.group({
    text:['', [Validators.required]]
  });

  @Input()
  public get_id:number = 0;

  @Input()
  public elimina_text:string = '';

  @Input()
  public text_change:string = '';

  private get confirm_text():string {
    return this.confirmForm.get('text')?.value!;
  }

  // @Output()
  // public confirm_elimina = new EventEmitter<number>();

  @Output()
  public confirmar = new EventEmitter<boolean>();

  public isConfirmed = new EventEmitter<boolean>();

  ngOnChanges(): void {
    // switch(this.reset_form) {
    //   default:
    //     this.confirmForm.reset();
    //   break;
    // }
  }

  confirm = ():void => {
    if(this.confirm_text === undefined || this.confirm_text === '') {
      Swal.fire({
        icon:'error',
        title:'¡Confirmación fallida!',
        text:'No se ha proporcionado la frase de confirmación.',
        showConfirmButton:false,
        timer:2300
      })
      this.confirmForm.markAllAsTouched();
    } else if(this.confirm_text === this.elimina_text) {
      Swal.fire({
        icon:'success',
        title:'¡Confirmación correcta!',
        text:'La frase de confirmación se ha validado correctamente.',
        showConfirmButton:false,
        timer:2300
      }).then(() => {
        this.confirmar.emit(true);
        this.confirmForm.patchValue({text:''});
        this.close();
      })
    } else {
      Swal.fire({
        icon:'error',
        title:'¡Confirmación inválida!',
        text:'Se proporcionó una frase de confirmación incorrecta, ¡intente de nuevo!.',
        confirmButtonText:'Corregir frase'
      }).then((result) => {
        if(result.isConfirmed) {
          this.confirmForm.get('text')?.setValue('');
        }
      })
    }
  }

  close = ():void => {
    $('#deleteConfirm').modal('hide');
    this.confirmForm.patchValue({text:''});
    setTimeout(() => {
      this.confirmForm.markAsUntouched();
    },500)
  }

  isValidField = (field:string):boolean => {
    return this.validatorsService.isValidField(this.confirmForm, field)!;
  }

  getFieldErrors = (field:string):string => {
    return this.validatorsService.getFieldError(this.confirmForm, field)!;
  }

}
