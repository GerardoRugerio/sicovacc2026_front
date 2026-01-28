import { Component, EventEmitter, inject, input, Input, OnChanges, OnInit, output, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../auth/services/auth.service';
import { User } from '../../../auth/interfaces/user.interface';
import { ValidatorsService } from '../../../shared/services/validators.service';
import { VerificaService } from '../../../auth/services/verifica.service';
import { forkJoin } from 'rxjs';
import Swal from 'sweetalert2';

declare let $:any;

@Component({
  selector: 'main-confirma-accion',
  templateUrl: './confirma-accion.component.html',
  styles: `
  .modal-content {
    background-color: rgb(238, 238, 238);
    border-top: 5px solid #522A78;
    border-radius: 3px;
  }
  .modal-dialog-centered {
    width:430px;
  }

  input {
    text-transform:none !important;
  }

  .btn-main-action, .btn-secondary {
    width: 100% !important;
  }
  `
})
export class ConfirmaAccionComponent implements OnInit {
  private fb = inject(FormBuilder);
  private validatorsService = inject(ValidatorsService);
  private authService = inject(AuthService);
  private verifyService = inject(VerificaService);

  public accessForm:FormGroup = this.fb.group({
    usuario:['', [Validators.required]],
    contrasena:['',[Validators.required]]
  })

  //Inputs de datos para el manejo del funcionamiento del formulario de confirmación de permisos para edición/eliminación.
  public modal = input<string>('');
  public reset = input<number>(0);

  //Output de confirmación de cierre del formulario desde el componente padre donde esté siendo llamado.
  public confirm = output<boolean>();
  public close = output<boolean>();

  ngOnInit(): void {
    $('#confirmaAccion').modal('show');
  }

  acceder = ():void => {
    if(this.accessForm.invalid) {
      this.accessForm.markAllAsTouched();
      Swal.fire({
        icon:'warning',
        title:'¡Formulario inválido!',
        text:'Todos los campos del formulario deben contener los datos requeridos.',
        cancelButtonText:'Entendido',
        allowEscapeKey:false,
        allowOutsideClick:false
      });
      return;
    }

    Swal.fire({
      title:'Espere un momento',
      text:'Realizando la verificación de las credenciales de acceso, un momento...',
      allowEscapeKey:false,
      allowOutsideClick:false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    forkJoin({
      verify: this.verifyService.checkAuthentication(),
      res: this.authService.loginTitular(this.accessForm.value as User)
    }).subscribe(({verify, res}) => {
    // }).subscribe(({res}) => {
      Swal.close();
      if(!verify) return;
      Swal.fire({
        icon:res.success ? 'success' : 'error',
        title:res.success ? '¡Correcto!' : '¡Error!',
        text:res.msg,
        showConfirmButton: false,
        timer: 1600
      }).then(() => {
        if(res.success) {
          this.cerrar(true);
        }
      })
    })
  }
  // acceder = ():void => {
  //   if(this.myForm.invalid) {
  //     this.myForm.markAllAsTouched();
  //     Swal.fire({
  //       icon:'warning',
  //       title:'¡Formulario inválido!',
  //       text:'Ambos campos del formulario deben contener los datos solicitados.',
  //       showConfirmButton:false,
  //       allowEscapeKey: false,
  //       allowOutsideClick: false,
  //       timer:1500
  //     });
  //     return;
  //   }

  //   Swal.fire({
  //     title: 'Espere un momento',
  //     text: 'Verificando credenciales, un momento por favor...',
  //     allowOutsideClick: false,
  //     didOpen: () => {
  //       Swal.showLoading();
  //     }
  //   });

  //   // Verifica el token de sesión y luego intenta iniciar sesión con los datos del formulario
  //   forkJoin({
  //     verify: this.verificaServide.checkAuthentication(),
  //     res: this.authService.loginTitular(this.myForm.value as User)
  //   }).subscribe(({ verify, res }) => {
  //     if(!verify) return;

  //     Swal.fire({
  //       icon: res.success ? 'success' : 'error',
  //       title: res.success ? '¡Correcto!' : '¡Error!',
  //       text: res.success ? res.msg : `${res.msg}, ¡intentar de nuevo!`,
  //       showConfirmButton: false,
  //       timer: 1600
  //     }).then(() => {
  //       if(res.success) {
  //         this.myForm.reset();
  //         $('#confirmaAccion').modal('hide');
  //         if(this.modal !== 'incidencia') {
  //           $('#capturaActas').modal('show');
  //           this.accion.emit(true);
  //         }
  //         else {
  //           this.accion.emit(true);
  //         }
  //       }
  //     })
  //   })
  // }

  cerrar = (submit:boolean | undefined = undefined):void => {
    $('#confirmaAccion').modal('hide');
    if(submit) {
      this.confirm.emit(true);
    }
    setTimeout(() => {
      this.close.emit(false);
    },400);
  }

  isValidField(field:string) {
    return this.validatorsService.isValidField(this.accessForm, field);
 }

 getFieldErrors(field:string) {
   return this.validatorsService.getFieldError(this.accessForm, field);
 }
}
