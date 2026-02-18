// import { Location } from '@angular/common';
// import { Component, inject, OnInit, HostListener } from '@angular/core';
// import { FormBuilder, FormControl, Validators } from '@angular/forms';
// import { Router } from '@angular/router';

// import { ComputoService } from '../../services/computo.service';
// import { DbStatusService } from '../../../auth/services/db-status.service';
// import { AuthService } from '../../../auth/services/auth.service';
// import { VerificaService } from '../../../auth/services/verifica.service';
// import { ValidatorsService } from '../../../shared/services/validators.service';
// import { CloseElementsService } from '../../../shared/services/close-elements.service';

// import { Status } from '../../../auth/interfaces/database-status.interface';
// import { Computo } from '../../interfaces/inicio-computo.interface';
// import { firstValueFrom, forkJoin } from 'rxjs';

// import Swal from 'sweetalert2';

// declare let $:any;

// @Component({
//   selector: 'app-computo-page',
//   templateUrl: './computo-page.component.html',
//   styleUrl: './computo-page.component.css'
// })
// export class ComputoPageComponent implements OnInit {
//   private fb = inject(FormBuilder);
//   private location = inject(Location);
//   private router = inject(Router);
//   private computoService = inject(ComputoService);
//   private dbStatusService = inject(DbStatusService);
//   private authService = inject(AuthService);
//   private verifyService = inject(VerificaService);
//   private validatorsService = inject(ValidatorsService);
//   private closeElements = inject(CloseElementsService);

//   //Inicialización del formulario.
//   public computoForm = this.fb.group({
//     MSPEN:['',[Validators.required, Validators.min(0)]],
//     COPACO:['',[Validators.required, Validators.min(0)]],
//     personasObservadoras:['',[Validators.required, Validators.min(0)]],
//     presentaronProyecto:['',[Validators.required, Validators.min(0)]],
//     mediosComunicacion:['',[Validators.required, Validators.min(0)]],
//     otros:['',[Validators.required, Validators.min(0)]],
//     fecha:['',[Validators.required]],
//     hora:['',[Validators.required]],
//     observaciones:['',[Validators.required, Validators.min(0), Validators.max(500)]]
//   });

//   //Variables y arrays de funcionamiento para el formulario.
//   public datosStatus?:Status;
//   public computo:string = '';
//   public datos?:Computo;
//   public maxlength:number = 500;

//   private path:string = '';
//   private anio:number = 0;

//   //Getters de información para operación y cambios en el formulario.
//   get inicioValidacion():boolean {return this.authService.inicioValidacion()!};
//   get cierreValidacion():boolean {return this.authService.cierreValidacion()!};

//   //Getters de campos del formulario.
//   get fecha_input():FormControl {
//     return this.computoForm.get('fecha') as FormControl;
//   }
//   get hora_input():FormControl {
//     return this.computoForm.get('hora') as FormControl;
//   }
//   get observaciones_input():FormControl {
//     return this.computoForm.get('observaciones') as FormControl;
//   }

//   //Getters de los valores obtenidos de los campos del formulario.
//   get fecha():string {
//     return this.fecha_input.value;
//   }
//   get observaciones():string {
//     return this.observaciones_input.value;
//   }

//   ngOnInit(): void {
//     this.anio = new Date().getFullYear();
//     this.computo = this.location.path().match('inicio_validacion') ? 'inicio' : 'conclusión';
//     this.path = this.computo == 'inicio' ? 'InicioValidacion' : 'cierreValidacion';

//     if(this.computo.match('inicio')) {
//       if(this.inicioValidacion) {
//         this.getDatosComputo();
//       }
//     } else {
//       if(this.cierreValidacion) {
//         this.getDatosComputo();
//       }
//     }
//   }

//   //Sumatoria de integrantes en el inicio/cierre de la validación.
//   total = ():number => {
//     let suma = 0;
//     Object.keys(this.computoForm.controls).forEach(key => {
//       if(!['fecha','hora','observaciones'].includes(key))
//       suma += +this.computoForm.get(key)?.value;
//     })
//     return suma;
//   }

//   getDatosComputo = ():void => {
//     Swal.fire({
//       title:'Espere un momento',
//       html:`Cargando datos de${this.computo == 'inicio' ? 'l inicio' : ' la conclusión'} de la validación...`,
//       allowEscapeKey:false,
//       allowOutsideClick:false,
//       didOpen: () => {
//         Swal.showLoading();
//       }
//     });

//     forkJoin({
//       verify: this.verifyService.checkAuthentication(),
//       datosDB: this.dbStatusService.getDatosStatus(),
//       datosComputo: this.computoService.getDatosComputo(this.path)
//     }).subscribe(({verify, datosDB, datosComputo}) => {
//     // }).subscribe(({datosDB, datosComputo}) => {
//       if(!verify) return;
//       this.datosStatus = datosDB.datos as Status;
//       // if(this.computo == 'conclusión' && this.datosStatus.UTPorValidar > 0) {
//       //   Swal.fire({
//       //     icon:'error',
//       //     title:'¡No permitido!',
//       //     html:'No se permite realizar la conclusión de la validación, <b>existen Unidades Territoriales por validar.</b>',
//       //     confirmButtonText:'Entendido',
//       //     allowEscapeKey:false,
//       //     allowOutsideClick:false
//       //   });
//       //   Object.keys(this.computoForm.controls).forEach(key => {
//       //     this.computoForm.get(key)?.disable();
//       //   })
//       //   return;
//       // }
//       this.datos = datosComputo.datos as Computo;
//       this.computoForm.patchValue(this.datos);
//       Swal.close();
//     })
//   }

//   sendComputo = (option:number):void => {
//     if(this.inicioValidacion && this.cierreValidacion && this.computo == 'inicio') {
//       Swal.fire({
//         icon:'error',
//         title:'¡No permitido!',
//         html:`Ya se ha realizado la conclusión de la validación, por lo tanto <i class="text-danger">no está permitido modificar los datos del inicio.</i>`,
//         confirmButtonText:'Entendido'
//       });
//       return;
//     }

//     if(this.computoForm.invalid) {
//       Swal.fire({
//         icon:'warning',
//         title:'¡Atención!',
//         html:`Se requiere que todas las validaciones presentes en el formulario se cumplan para continuar con este proceso, llene todos los campos e intente de nuevo.`,
//         allowEscapeKey:false,
//         allowOutsideClick:false,
//         confirmButtonText:'Entendido'
//       }).then(() => {
//         this.computoForm.markAllAsTouched();
//       })
//       return;
//     }

//     if(this.fecha !== '' && +this.fecha.split('-')[0] < this.anio) {
//       Swal.fire({
//         icon:'error',
//         title:'¡No permitido!',
//         text:'El año seleccionado es inválido, no se permiten años anteriores al año en curso.',
//         allowEscapeKey:false,
//         allowOutsideClick:false,
//         confirmButtonText:'Corregir selección'
//       }).then(() => {
//         this.fecha_input.setValue('');
//       })
//       return;
//     }

//     if(this.observaciones.length > this.maxlength) {
//       Swal.fire({
//         icon:'error',
//         title:'¡No permitido!',
//         text:'Se ha excedido el límite de caracteres permitidos para el campo de observaciones, es necesario resumir el texto e intentar de nuevo.',
//         allowEscapeKey:false,
//         allowOutsideClick:false,
//         confirmButtonText:'Entendido'
//       }).then(() => {
//         $('#observaciones').select();
//       })
//       return;
//     }

//     this.validar(option)
//   }

//   validar = (option:number):void => {
//     Swal.fire({
//       icon:'question',
//       title:`¿Confirmar ${this.computo == 'inicio' && !this.inicioValidacion ? 'registro de inicio' :
//       (this.computo == 'conclusión' && !this.cierreValidacion ? 'registro de conclusión' : '')}?`,
//       text:'',
//       showCancelButton:true,
//       cancelButtonText:'Cancelar',
//       confirmButtonText:'Confirmar',
//       allowEscapeKey:false,
//       allowOutsideClick:false,
//       showLoaderOnConfirm:true,
//       preConfirm: async () => {
//         const valid = await firstValueFrom(this.verifyService.checkAuthentication());
//         if(!valid) return;

//         const result = await firstValueFrom(this.computoService.computo(this.total(),this.computoForm.value as Computo,option, this.path)!);

//         if(!result.success) {
//           Swal.showValidationMessage(
//             result.msg || 'Ocurrió un error al guardar los datos.'
//           )
//           return false;
//         }
//         return result;
//       }
//     }).then((result) => {
//       if(result.isConfirmed && result.value && result.value.success) {
//         Swal.fire({
//           icon:'success',
//           title:'¡Correcto!',
//           text:result.value.msg,
//           showConfirmButton:false,
//           allowEscapeKey:false,
//           allowOutsideClick:false,
//           timer:2400
//         }).then(() => {
//           if(option < 2) {
//             // this.router.navigateByUrl('distrital');
//             // this.closeElements.close();
//           }
//           if(this.path == 'InicioValidacion') {
//             this.authService.inicioValidacion.set(true);
//           } else{
//             this.authService.cierreValidacion.set(true);
//           }
//         })
//       }
//     })
//   }

//   onlyNumbers = (event:KeyboardEvent, limit:number) => {
//     const input = event.target as HTMLInputElement;

//     const selectionStart = input.selectionStart ?? 0;
//     const selectionEnd = input.selectionEnd ?? 0;
//     const selectedTextLength = selectionEnd - selectionStart;

//     const currentLength = input.value.length;

//     const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Tab', 'Delete'];
//     if(allowedKeys.includes(event.key)) {
//       return;
//     }

//         // Si no es un número
//     if(!/^\d$/.test(event.key)) {
//       event.preventDefault();
//       return;
//     }

//     const willBeLength = currentLength - selectedTextLength + 1;
//     if (willBeLength > limit) {
//       event.preventDefault();
//     }
//   }

//   next = (event:any, id:string) => {
//     let keyCode = event.keyCode;

//     if(keyCode == 13) {
//       $(`#${id}`).select();
//     }
//   }

//   touched = ():boolean => {
//     // return false;
//     if(this.getFieldLentghtErrors('observaciones') == 'Este campo es obligatorio' || this.observaciones.length > this.maxlength) {
//       return true;
//     } else {
//       return false;
//     }
//   }

//   isValidField = (field:string):boolean => {
//     return this.validatorsService.isValidField(this.computoForm, field)!;
//   }

//   getFieldErrors = (field:string):string => {
//     return this.validatorsService.getFieldError(this.computoForm,field)!;
//   }

//   getFieldLentghtErrors = (field:string):string => {
//     return this.validatorsService.getFieldLengthError(this.computoForm, field, this.maxlength);
//   }
// }

import { Location } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ComputoService } from '../../services/computo.service';
import { DbStatusService } from '../../../auth/services/db-status.service';
import { AuthService } from '../../../auth/services/auth.service';
import { VerificaService } from '../../../auth/services/verifica.service';
import { ValidatorsService } from '../../../shared/services/validators.service';
import { Status } from '../../../auth/interfaces/database-status.interface';
import { Computo } from '../../interfaces/inicio-computo.interface';
import { firstValueFrom, forkJoin } from 'rxjs';
import Swal from 'sweetalert2';

declare let $:any;

@Component({
  selector: 'app-computo-page',
  templateUrl: './computo-page.component.html',
  styleUrl: './computo-page.component.css'
})
export class ComputoPageComponent implements OnInit {
  private fb = inject(FormBuilder);
  private location = inject(Location);
  private computoService = inject(ComputoService);
  private dbStatusService = inject(DbStatusService);
  private authService = inject(AuthService);
  private verifyService = inject(VerificaService);
  private validatorsService = inject(ValidatorsService);

  // Declaración del formulario de inicio de computo.
  public computoForm: FormGroup = this.fb.group({
    MSPEN:['',[Validators.required, Validators.min(0)]],
    COPACO:['',[Validators.required, Validators.min(0)]],
    personasObservadoras:['',[Validators.required, Validators.min(0)]],
    presentaronProyecto:['',[Validators.required, Validators.min(0)]],
    mediosComunicacion:['',[Validators.required, Validators.min(0)]],
    otros:['',[Validators.required, Validators.min(0)]],
    fecha:['',[Validators.required]],
    hora:['',[Validators.required]],
    observaciones:['',[Validators.required, Validators.min(0), Validators.max(500)]]
  });

  //Declaración de variables(señales) para el funcionamiento del formulario principal.
  public dbStatus = signal<Status | undefined>(undefined);
  public computo = signal<string>('');
  public data = signal<Computo | undefined>(undefined);
  public maxlength = signal<number>(1000);
  public path = signal<string>('');
  public anio = signal<number>(0);
  public dataStatus = signal<Status | undefined>(undefined);
  public totalCapturadas = signal<number>(0);

  //Obtención del estatus del Inicio/Cierre de la validación.
  public inicioValidacion = computed(() => this.authService.inicioValidacion());
  public cierreValidacion = computed(() => this.authService.cierreValidacion());

  //Obtención de los campos del formulario.
  get MSPEN():FormControl {return this.computoForm.get('MSPEN') as FormControl};
  get COPACO():FormControl {return this.computoForm.get('COPACO') as FormControl};
  get personasObservadoras():FormControl {return this.computoForm.get('personasObservadoras') as FormControl};
  get presentaronProyecto():FormControl {return this.computoForm.get('mediosComunicacion') as FormControl};
  get mediosComunicacion():FormControl {return this.computoForm.get('mediosComunicacion') as FormControl};
  get otros():FormControl {return this.computoForm.get('otros') as FormControl};
  get fecha():FormControl {return this.computoForm.get('fecha') as FormControl};
  get hora():FormControl {return this.computoForm.get('hora') as FormControl};
  get observaciones():FormControl {return this.computoForm.get('observaciones') as FormControl};

  //Obtención de los valores de los campos del formulario.
  get mspen():number {return this.MSPEN.value};
  get copaco():number {return this.COPACO.value};
  get observadoras():number {return this.personasObservadoras.value};
  get presProy():number {return this.presentaronProyecto.value};
  get comunicacion():number {return this.mediosComunicacion.value};
  get otro():string {return this.otros.value};
  get date():string {return this.fecha.value};
  get hour():string {return this.hora.value};
  get observ():string {return this.observaciones.value};

  ngOnInit(): void {
    this.anio.set(new Date().getFullYear());
    this.computo.set(this.location.path().match('inicio_validacion') ? 'inicio' : 'conclusión');
    this.path.set(this.computo() == 'inicio' ? 'inicioValidacion' : 'cierreValidacion');

    if(this.computo().match('inicio')) {
      if(this.inicioValidacion()) {
        this.getDatos();
      }
    } else {
      if(this.cierreValidacion()) {
        this.getDatos();
      } else {
        this.getStatus();
      }
    }
  }

  total = ():number => {
    let total = 0;
    Object.keys(this.computoForm.controls).forEach(key => {
      if(!['fecha','hora','observaciones'].includes(key)) {
        total += +this.computoForm.get(key)?.value;
      }
    })
    return total;
  }

  getStatus = ():void => {
    Swal.fire({
      title:'Espere un momento',
      text:'Verificando estatus del Cómputo y la Validación...',
      allowEscapeKey:false,
      allowOutsideClick:false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    forkJoin({
      verify: this.verifyService.checkAuthentication(),
      res: this.dbStatusService.getDatosStatus()
    }).subscribe(({verify, res}) => {
      if(!verify) return;
      Swal.close();
      this.dbStatusService.status.set(res.datos as Status);
      this.dataStatus.set(this.dbStatusService.status());
      this.totalCapturadas.set(this.dataStatus()?.conteo.conteo_C.actasPorCapturar! + this.dataStatus()?.conteo.conteo_CC1.actasPorCapturar! +
      this.dataStatus()?.conteo.conteo_CC2.actasPorCapturar!);
      if(this.totalCapturadas() > 0) {
        this.computoForm.disable();
        Swal.fire({
          icon:'error',
          title:'¡No permitido!',
          html:'No se permite realizar la conclusión del cómputo y validación, <b>existen Unidades Territoriales con cómputo o validaciones pendientes.</b>',
          confirmButtonText:'Entendido',
          allowEscapeKey:false,
          allowOutsideClick:false
        });
      }
    });
  }

  getDatos = ():void => {
    Swal.fire({
      title:'Espere un momento',
      text:`Cargando datos de${this.computo().match('inicio') ? 'l inicio' : ' la conclusión'} de la validación...`,
      allowEscapeKey:false,
      allowOutsideClick:false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    forkJoin({
      verify: this.verifyService.checkAuthentication(),
      res: this.computoService.getDatosComputo(this.path())
    }).subscribe(({verify, res}) => {
      if(!verify) return;
      Swal.close();
      this.computoForm.patchValue(res.datos as Computo);
    })
  }

  sendDatos = ():void => {
    if(this.computoForm.invalid) {
      this.computoForm.markAllAsTouched();
      Swal.fire({
        icon:'warning',
        title:'¡Atención!',
        html:`Todos los campos marcados como obligatorios deben contener los datos requeridos para continuar`,
        allowEscapeKey:false,
        allowOutsideClick:false,
        showConfirmButton:false,
        timer:2500
      });
      return;
    }

    if(this.date !== '' && +this.date.split('-')[0] < this.anio()) {
      Swal.fire({
        icon:'error',
        title:'¡No permitido!',
        text:'El año seleccionado es inválido.',
        allowEscapeKey:false,
        allowOutsideClick:false,
        confirmButtonText:'Corregir selección'
      }).then(() => {
        this.fecha.setValue('');
      })
      return;
    }

    if(this.observ.length > this.maxlength()) {
      Swal.fire({
        icon:'error',
        title:'¡No permitido!',
        text:'Se ha excedido el límite de caracteres permitidos para el campo de observaciones, es necesario resumir el texto e intentar de nuevo.',
        allowEscapeKey:false,
        allowOutsideClick:false,
        confirmButtonText:'Entendido'
      }).then(() => {
        $('#observaciones').select();
      })
      return;
    }
    this.sendValidation();
  }

  sendValidation = ():void => {
    Swal.fire({
      icon:'question',
      title:`¿Confirmar ${this.buttonStyle() ? 'actualización' : 'registro'} de${this.computo().match('inicio') ? 'l inicio' : ' la conclusión'}
      de los cómputos y la validación?`,
      html:`${this.computo().match('conclusión') && !this.cierreValidacion() ? 'Al realizar el cierre de la validación el acceso a algunas secciones se verá límitado, ¿Desea confirmar?' : ''}`,
      showCancelButton:true,
      cancelButtonText:'Cancelar',
      confirmButtonText:'Confirmar',
      allowEscapeKey:false,
      allowOutsideClick:false,
      showLoaderOnConfirm:true,
      preConfirm: async () => {
        const verify = await firstValueFrom(this.verifyService.checkAuthentication());
        if(!verify) return;
        const res = await firstValueFrom(this.computoService.setComputo(
          this.total(),
          this.computoForm.value as Computo,
          this.buttonStyle() && this.computo().match('inicio') ? 2 : 1,
          this.path()
        ));
        if(!res.success) {
          Swal.showValidationMessage(res.msg || 'Ocurrió un error en el proceso');
          return false;
        }
        return res;
      }
    }).then((result) => {
      if(result.isConfirmed && result.value && result.value.success) {
        Swal.fire({
          icon:'success',
          title:'¡Correcto!',
          text:result.value.msg,
          showConfirmButton:false,
          timer:2300
        }).then(() => {
          if(this.computo().match('inicio')) {
            this.authService.inicioValidacion.set(true);
          } else {
            this.authService.cierreValidacion.set(true);
          }
        })
      }
    })
  }

  touched = ():boolean => {
    if(this.getFieldLentghtErrors('observaciones') == 'Este campo es obligatorio' || this.observ.length > this.maxlength()) {
      return true;
    } else {
      return false;
    }
  }

  buttonStyle = ():boolean => {
    if(this.computo().match('inicio')) {
      if(this.inicioValidacion()) {
        return true;
      } else {
        return false;
      }
    } else {
      if(this.cierreValidacion()) {
        return true;
      } else {
        return false;
      }
    }
  }

  blockKeys = (event:KeyboardEvent):void => {
    if(event.key == 'ArrowUp' || event.key == 'ArrowDown') {
      event.preventDefault();
    }
  }

  limitNumbers = (event:KeyboardEvent, limit:number):boolean => {
    const key = event.target as HTMLInputElement;
    const max = limit;

    const keysAllowed = ['Backspace','Delete','ArrowLeft','ArrowRight','Home','End','Tab'];

    if(event.key == 'ArrowUp' || event.key == 'ArrowDown') {
      event.preventDefault();
    }

    if(keysAllowed.includes(event.key)) return true;
    if(!/^\d$/.test(event.key)) {
      event.preventDefault();
      return false;
    }

    const start = key.selectionStart ?? 0;
    const end = key.selectionEnd ?? 0;

    const newLength = key.value.length - (end - start) + 1;
    if(newLength > max) {
      event.preventDefault();
      return false;
    }

    return true;
  }

  nextField = (event:KeyboardEvent, id:string):void => {
    if(event.key == 'Enter') {
      event.preventDefault();
      if(id !== 'submit') {
        $(`#${id}`).select();
      } else {
        this.sendDatos();
      }
    }
  }

  block = (event:KeyboardEvent):void => {
    if(event.key == 'Enter') {
      event.preventDefault();
      return;
    }
  }

  //Funciones de validación del formulario.
  isValid = (field:string):boolean => this.validatorsService.isValidField(this.computoForm, field)!;
  getFieldErrors = (field:string):string => this.validatorsService.getFieldError(this.computoForm, field);
  getFieldLentghtErrors = (field:string):string => this.validatorsService.getFieldLengthError(this.computoForm, field, this.maxlength());
}
