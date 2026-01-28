// import { Component, inject, OnInit } from '@angular/core';
// import { Catalogo } from '../../../main/interfaces/catalogo.inteface';
// import { FormBuilder, FormControl } from '@angular/forms';
// import { ObtainUTService } from '../../services/obtain-ut.service';
// import { Acta } from '../../../main/interfaces/captura_resultados_actas.interface';
// import Swal from 'sweetalert2';

// declare const $:any;

// @Component({
//   selector: 'deoeyg-lista-actas',
//   templateUrl: './lista-actas.component.html',
//   styleUrl: './lista-actas.component.css'
// })
// export class ListaActasComponent implements OnInit {
//   private fb = inject(FormBuilder);
//   private obtainUT = inject(ObtainUTService);

//   public myForm = this.fb.group({
//     distrito:[''],
//     clave_colonia:['']
//   })

//   public distritos:Catalogo[] = [];
//   public colonias:Catalogo[] | undefined;
//   public actas:Acta[] | undefined;
//   private id_acta:number = 0;
//   private anio:number = 0;

//   get input_distrito():FormControl {
//     return this.myForm.get('distrito') as FormControl;
//   }

//   get input_clave():FormControl {
//     return this.myForm.get('clave_colonia') as FormControl;
//   }

//   get id_distrito():string {
//     return this.input_distrito.value;
//   }

//   get clave():string {
//     return this.input_clave.value;
//   }

//   ngOnInit(): void {
//     this.myForm.get('clave_colonia')?.disable();
//     for(let i = 1; i <= 33; i++) {
//       this.distritos.push({id:i.toString(),nombre:i.toString()})
//     }
//   }

//   getAnioConsulta = (anio:number):void => {
//     this.anio = anio;
//     if(this.anio == 0) {
//       this.input_distrito.setValue('');
//       this.input_distrito.disable();
//     } else {
//       this.input_distrito.enable();
//     }
//     this.getListaUTs();
//   }

//   getListaUTs = ():void => {
//     this.input_clave.setValue('');
//     if(this.id_distrito !== '') {
//       Swal.fire({
//         title:'Espere un momento',
//         text:'Cargando lista de Unidades Territoriales para este distrito...',
//         allowEscapeKey:false,
//         allowOutsideClick:false,
//         didOpen: () => {
//           Swal.showLoading();
//         }
//       })
//       this.obtainUT.getUnidadTerritorial(this.anio, this.id_distrito)
//       .subscribe(res => {
//         Swal.close();
//         if(!res.success) {
//           Swal.fire({
//             icon:'warning',
//             title:'¡Atención!',
//             text:res.msg,
//             confirmButtonText:'Entendido'
//           })

//           this.input_clave.setValue('');
//           this.input_clave.disable();
//           this.actas = undefined;
//           return;
//         }
//         this.colonias = res.datos as Catalogo[];
//         this.input_clave.enable();
//       })
//     } else {
//       this.input_clave.disable();
//     }
//     this.getListaActas();
//   }

//   getListaActas = ():void => {
//     this.actas = undefined;
//     if(this.clave !== '')  {
//       Swal.fire({
//         title:'Espere un momento',
//         text:'Cargando lista de actas capturadas de este distrito...',
//         allowEscapeKey:false,
//         allowOutsideClick:false,
//         didOpen:() => {
//           Swal.showLoading();
//         }
//       });

//       this.obtainUT.getActas(this.anio,this.id_distrito,this.clave)
//       .subscribe(res => {
//         Swal.close();
//         if(!res.success) {
//           Swal.fire({
//             icon:'warning',
//             title:'¡Atención!',
//             text:res.msg,
//             showConfirmButton:false,
//             timer:2300
//           })
//           return;
//         }
//         this.actas = res.datos as Acta[];
//       })
//     }
//   }

//   getIdActa = (id_acta:number):void => {
//     this.id_acta = id_acta;
//     $('#deleteConfirm').modal('show');
//   }

//   getDeleteConfirm = (confirm:boolean):void => {
//     if(confirm) {
//       Swal.fire({
//         title:'Espere un momento',
//         text:'Se está procesando esta acción',
//         allowEscapeKey:false,
//         allowOutsideClick:false,
//         didOpen:() => {
//           Swal.showLoading();
//         }
//       })

//       this.obtainUT.deleteActas(this.id_acta)
//       .subscribe(res => {
//         Swal.close();

//         Swal.fire({
//           icon:res.success ? 'success' : 'error',
//           title:res.success ? '¡Correcto!' : '¡Error!',
//           text:res.msg,
//           showConfirmButton:false,
//           timer:2500
//         }).then(() => {
//           if(res.success) {
//             this.getListaUTs();
//           }
//         })
//       })
//     }
//   }
// }

import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { CentralService } from '../../services/central.service';
import { Catalogo } from '../../../main/interfaces/catalogo.inteface';
import { Acta } from '../../../main/interfaces/captura_resultados_actas.interface';
import { CatalogosService } from '../../../main/services/catalogos.service';
import Swal from 'sweetalert2';
import { VerificaService } from '../../../auth/services/verifica.service';
import { forkJoin } from 'rxjs';


declare let $:any;
@Component({
  selector: 'deoeyg-lista-actas',
  templateUrl: './lista-actas.component.html',
  styleUrl: './lista-actas.component.css'
})
export class ListaActasComponent implements OnInit {
  private fb = inject(FormBuilder);
  private centralService = inject(CentralService);
  private catalogosService = inject(CatalogosService);
  private verifyService = inject(VerificaService);

  //Declaración del formulario principal para búsqueda de las actas.
  public centralForm:FormGroup = this.fb.group({
    distrito:[''],
    clave_colonia:['']
  });

  //Declaración de las variables(señales) para la operación del formulario principal.
  public listaDistritos = signal<Catalogo[]>([]);
  public listaColonias = signal<Catalogo[]>([]);
  public listaActas = signal<Acta[]>([]);
  public idActa = signal<number>(0);
  private anio = signal<number>(0);

  //Obtención de los campos del formulario principal.
  get idDistrito():FormControl {return this.centralForm.get('distrito') as FormControl};
  get claveColonia():FormControl {return this.centralForm.get('clave_colonia') as FormControl};

  //Obtención de los valores de los campos del formulario.
  get distrito():number {return this.idDistrito.value};
  get clave():string {return this.claveColonia.value};

  ngOnInit(): void {
    this.centralForm.disable();
    for(let i = 1; i <= 33; i++) {
      this.listaDistritos().push({id: i.toString(), nombre: i.toString()});
    }
  }

  getTextos = (tipo:number):string => {
    switch(tipo) {
      case 3:
        return '(MECPEP)';
      case 4:
        return '(MECPPP)';
      default:
        return '';
    }
  }

  private message = (text:string):void => {
    Swal.fire({
      title:'Espere un momento',
      text,
      allowEscapeKey:false,
      allowOutsideClick:false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
  }

  getAnio = (anio:number):void => {
    this.anio.set(anio);
    this.idDistrito.setValue('');
    this.claveColonia.setValue('');
    this.listaActas.set([]);
    if(this.anio() > 0) {
      this.idDistrito.enable();
    } else {
      this.idDistrito.disable();
      this.claveColonia.disable();
    }
  }

  getColonias = ():void => {
    this.claveColonia.setValue('');
    this.listaActas.set([]);
    this.claveColonia.setValue('');
    this.message('Cargando lista de Unidades Territoriales con actas capturadas...');
    forkJoin({
      verify: this.verifyService.checkAuthentication(),
      res: this.catalogosService.getCatalogo('coloniasConActas','',this.anio(),this.distrito)
    }).subscribe(({verify, res}) => {
      if(!verify) return;
      Swal.close();
      if(!res.success) {
        Swal.fire({
          icon:'warning',
          title:'¡Atención!',
          text:'No se encontraron Unidades Territoriales con captura de Actas en este distrito...',
          allowEscapeKey:false,
          allowOutsideClick:false,
          confirmButtonText:'Entendido'
        })
        this.claveColonia.disable();
        return;
      }
      this.listaColonias.set(res.datos as Catalogo[]);
      this.claveColonia.enable();
    })
  }

  getActas = ():void => {
    this.listaActas.set([]);
    this.message('Cargando lista de Actas Capturadas en esta Unidad Territorial...');
    forkJoin({
      verify: this.verifyService.checkAuthentication(),
      res: this.centralService.getActas(this.anio(), this.distrito, this.clave)
    }).subscribe(({verify, res}) => {
      if(!verify) return;
      Swal.close();
      this.listaActas.set(res.datos as Acta[]);

    })
  }

  deleteActa = (idActa:number):void => {
    Swal.fire({
      icon:'info',
      title:'¡Confirmación requerida!',
      html:`La eliminación de un Acta, <b>es un proceso que no puede ser revertido, </b> al dar clic en el botón
      <i class="text-primary">"Continuar"</i> se desplegará el formulario de confirmación del texto requerido.`,
      allowEscapeKey:false,
      allowOutsideClick:false,
      confirmButtonText:'Continuar'
    }).then(() => {
      Swal.fire({
        icon:'warning',
        title:'¡Atención!',
        html:`Se requiere la confirmación del texto requerido en pantalla para realizar la eliminación del acta seleccionada.`,
        input:'text',
        inputPlaceholder:'Eliminar Acta',
        customClass: {input:'input-sweet'},
        showCancelButton:true,
        cancelButtonText:'Cancelar',
        confirmButtonText:'Confirmar',
        allowEscapeKey:false,
        allowOutsideClick:false,
      }).then((result) => {
        if(result.isConfirmed) {
          if(result.value === 'Eliminar Acta') {
            Swal.fire({
              icon:'success',
              title:'¡Confirmación exitosa!',
              html: `La confirmación de la frase se ha realizado correctamente.`,
              showConfirmButton:false,
              timer:2300
            }).then(() => {
              this.message('Se está procesando la eliminación del acta...');
              forkJoin({
                verify: this.verifyService.checkAuthentication(),
                res: this.centralService.deleteActas(idActa, this.anio())
              }).subscribe(({verify, res}) => {
                if(!verify) return;
                Swal.close();
                Swal.fire({
                  icon:res.success ? 'success' : 'error',
                  title:res.success ? '¡Correcto!' : '¡Error!',
                  text:res.msg,
                  showConfirmButton:false,
                  timer:2400
                }).then(() => {
                  if(res.success) {
                    this.getActas();
                    if(this.listaActas().length == 0) {
                      this.claveColonia.setValue('');
                      this.claveColonia.disable();
                    }
                  }
                })
              })
            })
          } else {
            Swal.fire({
              icon:'error',
              title:'¡Confirmación fallida!',
              html:`La frase proporcionada: <i class="text-danger">${result.value}</i>, es incorrecta <b>¡intente de nuevo!</b>`,
              confirmButtonText:'Entendido'
            })
          }
        }
      })
    })
  }
}
