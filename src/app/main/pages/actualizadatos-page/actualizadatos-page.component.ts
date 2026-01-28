import { Component, inject, OnInit } from '@angular/core';
import { ActualizaService } from '../../services/actualiza.service';
import { FormBuilder, Validators } from '@angular/forms';
import { Actualiza } from '../../interfaces/actualiza-datos.interface';
import Swal from 'sweetalert2';
import { VerificaService } from '../../../auth/services/verifica.service';
import { ValidatorsService } from '../../../shared/services/validators.service';
import { firstValueFrom, forkJoin } from 'rxjs';

@Component({
  selector: 'app-actualizadatos-page',
  templateUrl: './actualizadatos-page.component.html',
  styleUrl: './actualizadatos-page.component.css'
})
export class ActualizadatosPageComponent implements OnInit {
  private actualizaService = inject(ActualizaService);
  private fb = inject(FormBuilder);
  private verificaService = inject(VerificaService);
  private validatorsService = inject(ValidatorsService);

  public myForm = this.fb.group({
    nombre_delegacion:['', [Validators.required]],
    domicilio:['', [Validators.required, Validators.maxLength(200)]],
    codigo_postal:[0],
    coordinador:['', [Validators.maxLength(100)]],
    coordinador_puesto:['', [Validators.maxLength(100)]],
    coordinador_genero:[''],
    secretario:['', [Validators.maxLength(100)]],
    secretario_puesto:['', [Validators.maxLength(100)]],
    secretario_genero:['']
  })

  public datos?:Actualiza;
  public maxlength:number = 200;

  ngOnInit(): void {
    this.getDatosDistrito();
    this.myForm.get('nombre_delegacion')?.disable();
  }

  getDatosDistrito = ():void => {
    Swal.fire({
      title:'Espere un momento',
      text:'Cargando datos del distrito...',
      allowEscapeKey:false,
      allowOutsideClick:false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    forkJoin({
      // verify: this.verificaService.checkAuthentication(),
      res: this.actualizaService.getDatosDistrito()
    // }).subscribe(({verify, res}) => {
    }).subscribe(({res}) => {
      // if(!verify) return;
      this.datos = res.datos as Actualiza;
      this.myForm.patchValue(this.datos);
      Swal.close();
    })
  }

  //Verifica que solo se puedan ingresar la cantidad de digitos especificada en la función.
  soloNumeros(e:any) {
    let charCode = e.charCode ? e.charCode : e.keyCode;
    if(charCode != 8 && charCode != 9) {
      let max = 5;
      if((charCode < 48 || charCode > 57) || (e.target.value.length >= max)) return false;
    }
    return true;
  }

  guardar = ():void => {
    if(this.myForm.invalid) {
      this.myForm.markAllAsTouched();
      Swal.fire({
        icon:'warning',
        title:'¡Atención!',
        text:'Todos los campos marcados como obligatorios deben contener la información solicitada.',
        confirmButtonText:'Entendido'
      })
      return;
    }

    Swal.fire({
      icon:'question',
      title:'¿Confirmar?',
      text:'Está a punto de actualizar los datos del distrito, ¿Confirmar?',
      showCancelButton:true,
      cancelButtonText:'Cancelar',
      confirmButtonText:'Confirmar',
      allowEscapeKey:false,
      allowOutsideClick:false,
      showLoaderOnConfirm:true,
      preConfirm: async () => {
        // const isValid = await firstValueFrom(this.verificaService.checkAuthentication());
        // if(!isValid) return;
        const result = await firstValueFrom(this.actualizaService.actualizaDatosDistrito(this.myForm.value as Actualiza));
        if(!result.success) {
          Swal.showValidationMessage(result.msg || 'Ocurrió un error en el proceso');
          return false;
        }
        return result;
      }
    }).then((result) => {
      if(result.isConfirmed && result.value && result.value.success) {
        Swal.fire({
          icon:'success',
          title:'¡Correcto!',
          text:'Se han actualizado los datos del distrito.',
          showConfirmButton:false,
          timer:2000,
          allowEscapeKey:false,
          allowOutsideClick:false
        }).then(() => {
          this.getDatosDistrito();
        })
      }
    })
  }

  touched = (field:string):boolean => {
    if(this.getFieldLengthError(field) == 'Este campo es obligatorio' || this.myForm.get(field)?.value.length! > (field !== 'domicilio' ? this.maxlength/2 : this.maxlength)) {
      return true;
    } else {
      return false;
    }
  }

  isValidField(field:string) {
    return this.validatorsService.isValidField(this.myForm, field);
  }

  getFieldErrors(field:string) {
    return this.validatorsService.getFieldError(this.myForm, field);
  }

  getFieldLengthError(field:string, maxlength:number = 0) {
    return this.validatorsService.getFieldLengthError(this.myForm,field, maxlength);
  }
}
