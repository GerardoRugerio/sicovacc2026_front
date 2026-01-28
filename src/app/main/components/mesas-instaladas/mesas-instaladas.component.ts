// export class MesasInstaladasComponent implements OnInit {

  // private computoService = inject(ComputoService);
  // private dtAttributes = inject(DtAttributesService);
  // private dbStatus = inject(DbStatusService);
  // private verificaService = inject(VerificaService);
  // private authService = inject(AuthService);
  // private fb = inject(FormBuilder);

  // public myForm = this.fb.group({
  //   tipo_eleccion:[''],
  //   mesas: this.fb.array([])
  // })

  // public mesas_instaladas:Mesa[] | undefined;
  // public dtOptions:Config = {};
  // public ver_mesas:boolean = false;
  // public db_data?:Status;


  // //Getters de datos para el funcionamiento del formulario.
  // get mesas():FormArray {return this.myForm.get('mesas') as FormArray};


  // //Otros getters.
  // get inicioValidacion():boolean {return this.authService.inicioValidacion!};
  // get cierreValidacion():boolean {return this.authService.cierreValidacion!};

  // ngOnInit(): void {
  //   //Configura las características de funcionamiento del DataTable.
  //   this.dtOptions = this.dtAttributes.dtOptions;

  //   // this.getListaMesas();
  //   //Con esta verificación al crear el componente se configura el formulario de manera en que no se puedan realizar modificaciones de marcado/desmarcado de mesas una vez iniciada la
  //   //validación.
  // }

  // getAnio = (anio:number):void => {
  //   if (anio > 0) {
  //   Swal.fire({
  //     title: 'Espere un momento',
  //     text: 'Cargando lista de Mesas no Instaladas...',
  //     allowEscapeKey: false,
  //     allowOutsideClick: false,
  //     didOpen: () => {
  //       Swal.showLoading();
  //     }
  //   });

  //   forkJoin({
  //     verify: this.verificaService.checkAuthentication(),
  //     status: this.dbStatus.getDatosStatus(1),
  //     mesas: this.computoService.getMesasInstaladas(anio)
  //   })
  //   .subscribe(({ verify, status, mesas }) => {
  //     if (!verify) return;
  //     this.db_data = status.datos as Status;
  //     Swal.close();
  //     if (this.db_data!.actasCapturadas > 0 && !this.cierreValidacion) {
  //       this.blockMessage('Ya se han capturado Actas, <b>¡ya no se permite marcar o desmarcar Mesas!</b>');
  //     } else if(this.inicioValidacion && this.cierreValidacion) {
  //       this.blockMessage('Ya se ha realizado la conclusión de la validación, <b>¡ya no se permite marcar o desmarcar Mesas!</b>')
  //     }
  //     this.mesas_instaladas = mesas.datos as Mesa[];
  //     this.mesas.clear();
  //     this.patchListaMesas(this.mesas_instaladas);
  //   });
  //   } else {
  //     this.mesas_instaladas = undefined;
  //   }
  // }

  // blockMessage = (text:string) => {
  //   return Swal.fire({
  //     icon: 'warning',
  //     title: '¡Atención!',
  //     html: text,
  //     allowOutsideClick: false,
  //     allowEscapeKey: false,
  //     confirmButtonText: 'Entendido'
  //   }).then(() => {
  //     this.myForm.disable();
  //   })
  // }

  // patchListaMesas = (lista_mesas:Mesa[]) => lista_mesas.forEach(mesa => this.mesas.push(this.fb.group({
  //   nombre_colonia: [mesa.nombre_colonia],
  //   clave_colonia: [mesa.clave_colonia],
  //   num_mro: [mesa.num_mro],
  //   tipo_mro:[mesa.tipo_mro],
  //   noInstalada: [mesa.noInstalada]
  // })))

  // //Se debe confirmar el registro de las mesas que no fueron instaladas.
  // guardarNoInstaladas = ():void => {
  //   Swal.fire({
  //     icon:'question',
  //     title:'¿Guardar mesas?',
  //     text:'Confirmar el registro de los cambios para las mesas no instaladas',
  //     showCancelButton:true,
  //     cancelButtonText:'Cancelar',
  //     confirmButtonText:'Confirmar',
  //     allowOutsideClick:false,
  //     allowEscapeKey:false,
  //     showLoaderOnConfirm:true,
  //     preConfirm: async () => {
  //       const verify = await firstValueFrom(this.verificaService.checkAuthentication());
  //       if(!verify) {
  //         return;
  //       }

  //       const result = await firstValueFrom(this.computoService.saveNoInstaladas(this.mesas.value as Mesa[]));
  //       if(!result.success) {
  //         Swal.showValidationMessage(result.msg || 'Ocurrió un error al guardar las mesas');
  //         return false;
  //       }
  //       return result;
  //     }
  //   }).then((result) => {
  //     if(result.isConfirmed && result.value && result.value.success) {
  //       Swal.fire({
  //         icon:'success',
  //         title:'¡Correcto!',
  //         text:result.value.msg,
  //         showConfirmButton:false,
  //         timer:2400
  //       })
  //     }
  //   })
  // }

  // getTipoMesa = (tipo:number):string => {
  //   switch(tipo) {
  //     case 3:
  //       return '(MECPEP)';
  //     case 4:
  //       return '(MECPPP)';
  //     default:
  //       return '';
  //   }
  // }

import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';

import { DtAttributesService } from '../../../shared/services/dt-attributes.service';
import { DbStatusService } from '../../../auth/services/db-status.service';
import { VerificaService } from '../../../auth/services/verifica.service';
import { AuthService } from '../../../auth/services/auth.service';
import { ComputoService } from '../../services/computo.service';
import { Config } from 'datatables.net';
import Swal from 'sweetalert2';
import { first, firstValueFrom, forkJoin } from 'rxjs';
import { Status } from '../../../auth/interfaces/database-status.interface';
import { Mesa } from '../../interfaces/inicio-computo.interface';

@Component({
  selector: 'main-mesas-instaladas',
  templateUrl: './mesas-instaladas.component.html',
  styleUrl: './mesas-instaladas.component.css'
})
export class MesasInstaladasComponent implements OnInit {
  private fb = inject(FormBuilder);
  private dbStatusService = inject(DbStatusService);
  private computoService = inject(ComputoService);
  private verifyService = inject(VerificaService);
  private dtService = inject(DtAttributesService);
  private authService = inject(AuthService);

  //Declaración del formulario reactivo para llenar la tabla con las Mesas disponibles para cada una de las UTs.
  public mesasForm:FormGroup = this.fb.group({
    mesas: this.fb.array([])
  });

  //Obtención del FormArray del formulario principal.
  get mesas():FormArray {return this.mesasForm.get('mesas') as FormArray};

  //Declaración de variable contenedora de los atributos del DataTable.
  public dtOptions:Config = {};

  //Declaración de variables(señales) para el funcionamiento de la página principal.
  public anio = signal<number>(0);
  public status = signal<Status | undefined>(undefined);
  public listaMesas = signal<Mesa[] | undefined>(undefined);
  public totalCapturadas = signal<number>(0);

  //Obtención del estatus del Inicio/Cierre de la validación.
  private inicioValidacion = computed(() => this.authService.inicioValidacion());
  private cierreValidacion = computed(() => this.authService.cierreValidacion());

  ngOnInit(): void {
    this.dtOptions = this.dtService.dtOptions;
  }

  getTextos = (tipo_mesa:number):string => {
    switch(tipo_mesa) {
      case 3:
        return '(MECPEP)';
      case 4:
        return '(MECPPP)';
      default:
        return '';
    }
  }

  getAnio = (anio:number):void => {
    this.anio.set(anio);
    this.listaMesas.set(undefined);
    if(this.anio() > 0) {
      this.getMesas();
    }
  }

  getMesas = ():void => {
    Swal.fire({
      title:'Espere un momento',
      text:'Cargando lista de Mesas disponibles para el año/tipo de consulta seleccionado...',
      allowEscapeKey:false,
      allowOutsideClick:false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
    this.listaMesas.set(undefined);
    this.mesas.clear();

    forkJoin({
      verify: this.verifyService.checkAuthentication(),
      status: this.dbStatusService.getDatosStatus(),
      res: this.computoService.getMesasInstaladas(this.anio())
    }).subscribe(({verify, status, res}) => {
      if(!verify) return;
      Swal.close();
      this.status.set(status.datos as Status);
      this.listaMesas.set(res.datos as Mesa[]);
      this.totalCapturadas.set(this.status()?.conteo.conteo_C.actasCapturadas! + this.status()?.conteo.conteo_CC1.actasCapturadas! +
      this.status()?.conteo.conteo_CC2.actasCapturadas!);
      this.patchListaMesas(this.listaMesas()!);
      if(this.cierreValidacion()) {
        this.mesas.disable();
        Swal.fire({
          icon:'error',
          title:'¡No permitido!',
          html:'Ya se ha realizado la conclusión de la validación, <b class="text-danger">no se permite modificar el marcado/desmarcado de Mesas.</b>',
          allowEscapeKey:false,
          allowOutsideClick:false,
          confirmButtonText:'Entendido'
        });
        return;
      }

      if(this.totalCapturadas() > 0) {
        this.mesas.disable();
        Swal.fire({
          icon:'warning',
          title:'¡Modificaciones deshabilitadas!',
          html:'Ya se han capturado actas, <b class="text-danger">por lo tanto, no se permite modificar el marcado/desmarcado de mesas no instaladas</b>',
          allowEscapeKey:false,
          allowOutsideClick:false,
          confirmButtonText:'Entendido'
        });
      }
    })
  }

  patchListaMesas = (lista_mesas:Mesa[]) => lista_mesas.forEach(mesa => this.mesas.push(this.fb.group({
    nombre_colonia: [mesa.nombre_colonia],
    clave_colonia: [mesa.clave_colonia],
    num_mro: [mesa.num_mro],
    tipo_mro:[mesa.tipo_mro],
    noInstalada: [mesa.noInstalada]
  })));

  private compareArrays = (a: Mesa[], b:Mesa[]):boolean => {
    if(a.length !== b.length) return false;

    return a.every((item, index) => {
      return JSON.stringify(item) === JSON.stringify(b[index]);
    })
  }

  verifyLista = (verify:boolean):void => {
    const mesasOrigen = this.listaMesas()!;
    const mesasForm = this.mesas.value;

    if(!this.compareArrays(mesasOrigen, mesasForm)) {
      Swal.fire({
        icon:'warning',
        title:'¡Hay cambios en el formulario!',
        html:`Asegurese de guardar los cambios realizados en el formulario antes de cambiar de año/tipo de consulta.`,
        allowEscapeKey:false,
        allowOutsideClick:false,
        confirmButtonText:'Entendido'
      })
    }
  }

  saveMesas = ():void => {
    if(this.cierreValidacion()) {
      Swal.fire({
        icon:'error',
        title:'¡No permitido!',
        html:'Ya se ha realizado la conclusión de la validación, <b>no se permite modificar el marcado/desmarcado de Mesas.</b>',
        confirmButtonText:'Entendido'
      }).then(() => {
        this.mesas.disable();
      })
      return;
    }

    Swal.fire({
      icon:'question',
      title:'¿Guardar mesas?',
      showCancelButton:true,
      cancelButtonText:'Cancelar',
      confirmButtonText:'Confirmar',
      allowEscapeKey:false,
      allowOutsideClick:false,
      showLoaderOnConfirm:true,
      preConfirm: async () => {
        const verify = await firstValueFrom(this.verifyService.checkAuthentication());
        if(!verify) return;
        const res = await firstValueFrom(this.computoService.saveNoInstaladas(this.mesas.value as Mesa[], this.anio()));
        if(!res.success) {
          Swal.showValidationMessage(res.msg || 'Ocurrió un error en el proceso.');
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
          this.listaMesas.set(this.mesas.value);
        })
      }
    })
  }
}
