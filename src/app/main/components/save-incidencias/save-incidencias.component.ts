import { Component, computed, inject, input, OnDestroy, OnInit, output, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { ValidatorsService } from '../../../shared/services/validators.service';
import { VerificaService } from '../../../auth/services/verifica.service';
import { IncidenciasService } from '../../services/incidencias.service';
import { CatalogosService } from '../../services/catalogos.service';
import { AuthService } from '../../../auth/services/auth.service';

import { Catalogo } from '../../interfaces/catalogo.inteface';
import { Incidencia } from '../../interfaces/incidentes.interface';
import { firstValueFrom, forkJoin } from 'rxjs';

import Swal from 'sweetalert2';

declare let $:any;

const message = (texto:string):void => {
  Swal.fire({
    title:'Espere un momento',
    text:texto,
    allowEscapeKey:false,
    allowOutsideClick:false,
    didOpen: () => {
      Swal.showLoading();
    }
  });
};

@Component({
  selector: 'main-save-incidencias',
  templateUrl: './save-incidencias.component.html',
  styleUrl: './save-incidencias.component.css'
})
export class SaveIncidenciasComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private verifyService = inject(VerificaService);
  private catalogosService = inject(CatalogosService);
  private incidenciasService = inject(IncidenciasService);
  private validatorsService = inject(ValidatorsService);
  private authService = inject(AuthService);

  //Declaración de los campos del formulario reactivo principal.
  public incidentesForm: FormGroup = this.fb.group({
    clave_colonia:['', [Validators.required,Validators.min(1)]],
    num_mro:['', [Validators.required, Validators.min(1)]],
    incidente_1:[false],
    incidente_2:[false],
    incidente_3:[false],
    incidente_4:[false],
    incidente_5:[false],
    fecha:['', [Validators.required]],
    hora:['', [Validators.required]] ,
    participantes:['', [Validators.required,Validators.maxLength(500)]],
    hechos:['', [Validators.required,Validators.maxLength(1000)]],
    acciones:['', [Validators.required,Validators.maxLength(1000)]]
  })

  //Declaración de los campos del formulario para posteriormente ser utilizados en el funcionamiento del flujo de trabajo.
  get claveColonia():FormControl {return this.incidentesForm.get('clave_colonia') as FormControl};
  get numMro():FormControl {return this.incidentesForm.get('num_mro') as FormControl};
  get fecha():FormControl {return this.incidentesForm.get('fecha') as FormControl};
  get hora():FormControl {return this.incidentesForm.get('hora') as FormControl};
  get incidente_1():FormControl {return this.incidentesForm.get('incidente_1') as FormControl};
  get incidente_2():FormControl {return this.incidentesForm.get('incidente_2') as FormControl};
  get incidente_3():FormControl {return this.incidentesForm.get('incidente_3') as FormControl};
  get incidente_4():FormControl {return this.incidentesForm.get('incidente_4') as FormControl};
  get incidente_5():FormControl {return this.incidentesForm.get('incidente_5') as FormControl};
  get participantes():FormControl {return this.incidentesForm.get('participantes') as FormControl};
  get hechos():FormControl {return this.incidentesForm.get('hechos') as FormControl};
  get acciones():FormControl {return this.incidentesForm.get('acciones') as FormControl};

  //Obtención de los valores de cada uno de los campos declarados del formulario.
  get clave():string {return this.claveColonia.value};
  get mesa():number {return this.numMro.value.split('-')[0]};
  get tipo():number {return this.numMro.value.split('-')[1]};
  get date():string {return this.fecha.value};
  get hour():string {return this.hora.value};
  get incidente1():boolean {return this.incidente_1.value};
  get incidente2():boolean {return this.incidente_2.value};
  get incidente3():boolean {return this.incidente_3.value};
  get incidente4():boolean {return this.incidente_4.value};
  get incidente5():boolean {return this.incidente_5.value};
  get part():string {return this.participantes.value};
  get hec():string {return this.hechos.value};
  get acc():string {return this.acciones.value};

  // Variable de activación/desactivación del formulario.
  public get active():boolean {return this.numMro.value !== '' ? true : false};


  //Declaración de variables(señales) de funcionamiento del formulario principal y elementos del modal.
  public listaColonias = signal<Catalogo[]>([]);
  public listaMesas = signal<Catalogo[]>([]);
  public anio = signal<number>(0);
  public delegacion = signal<string>('');
  public editar = signal<boolean>(false);
  public showModal = signal<boolean>(false);
  public invalid = signal<boolean>(false);

  //Declaración de variables(normales) de funcionamiento del formulario principal y elementos del modal.
  public maxlength:number = 1000;

  //Declaración de inputs de datos provenientes del padre.
  public incidente = input<Incidencia | undefined>();
  public anio_input = input<number>();

  //Declaración de outputs de datos que se compartirán al padre.
  public resetModal = output<boolean>();
  public reloadLista = output<boolean>();

  //Obtención del id del incidente desde el objeto obtenido mediante el input de datos provenientes del padre.
  public id_incidente = computed(() => this.incidente()?.id_incidente);

  //Obtención del estatus del Inicio/Cierre de la Validación.
  public inicioValidacion = computed(() => this.authService.inicioValidacion());
  public cierreValidacion = computed(() => this.authService.cierreValidacion());
  private rol = computed(() => this.authService.rol());

  ngOnInit(): void {
    const fecha = new Date();
    const dia = `${fecha.getDate()}`.padStart(2,'00');
    const mes = `${fecha.getMonth() + 1}`.padStart(2, '00');;
    const anio = fecha.getFullYear();
    const hora = fecha.getHours().toString();
    const minutos = fecha.getMinutes().toString();
    const fullHour = `${hora.padStart(2, '00')}:${minutos.padStart(2, '00')}`;
    const fullDate = `${anio}-${mes}-${dia}`;
    $('#registIncidentes').modal('show');
    this.numMro.disable();
    if(this.id_incidente() !== undefined) {
      this.incidentesForm.patchValue(this.incidente() as Incidencia);
    } else {
      this.fecha.setValue(fullDate);
      this.hora.setValue(fullHour);
    }
    this.incidentesForm.disable();
  }

  ngOnDestroy(): void {
    this.incidentesForm.reset();
    this.incidente.apply(undefined);
  }

  //Función de retorno de textos para el tipo de Mesa que se visualiza en el formulario principal.
  getTipoMesa = (tipo:number):string => {
    switch(tipo) {
      case 3:
        return '(MECPEP)';
      case 4:
        return '(MECPPP)';
      default:
        return '';
    }
  }

  //Función de retorno para texto del encabezado del formulario de captura.
  getTipo = (tipo:number):string => {
    switch(tipo) {
      case 3:
        return '(Personas en Estado de Postración)';
      case 4:
        return '(Personas en Prisión Preventiva)';
      default:
        return '';
    }
  }

  //Entrada de datos provenientes del componente hijo "<shared-selector>".
  getAnio = (anio:number):void => {
    this.anio.set(anio);
    this.listaColonias.set([]);
    this.listaMesas.set([]);
    this.claveColonia.setValue('');
    this.numMro.setValue('');
    this.numMro.disable();
    if(this.anio() > 0) {
      if(this.incidente() !== undefined) {
        this.getMesas();
      }
      this.getColonias();
    } else {
      this.claveColonia.disable();
    }
  }

  //Funciones de obtención de datos para los selectores de "Unidad Territorial" y "Mesas", del formulario principal.
  getColonias = ():void => {
    if(this.id_incidente() !== undefined) {
      return;
    } else {
      this.activeForm();
      message('Cargando lista de Unidades Territoriales disponibles...');
      forkJoin({
        verify: this.verifyService.checkAuthentication(),
        res: this.catalogosService.getCatalogo('colonias',undefined,this.anio())
      }).subscribe(({verify, res}) => {
        if(!verify) return;
        Swal.close();
        this.listaColonias.set(res.datos as Catalogo[]);
        if(res.success && this.listaColonias().length > 0) {
          this.claveColonia.enable();
        } else {
          Swal.fire({
            icon:'warning',
            title:'¡Atención!',
            text:'No se encontraron Unidades Territoriales para el año/tipo de consulta seleccionado.',
            allowEscapeKey:false,
            allowOutsideClick:false,
            confirmButtonText:'Entendido'
          });
          this.claveColonia.disable();
          this.numMro.disable();
          this.delegacion.set('');
        }
      })
    }
  }

  getMesas = ():void => {
    this.numMro.setValue('');
    this.activeForm();
    message('Cargando lista de Mesas disponibles...');
    forkJoin({
      verify: this.verifyService.checkAuthentication(),
      delegacion: this.catalogosService.getCatalogo('delegacion',this.incidente() == undefined ? this.clave : this.incidente()?.clave_colonia,this.anio()),
      res: this.catalogosService.getCatalogo('mesas',this.incidente() == undefined ? this.clave : this.incidente()?.clave_colonia,this.anio())
    }).subscribe(({verify, delegacion, res}) => {
      if(!verify) return;
      Swal.close();
      this.delegacion.set(delegacion.delegacion as string);
      this.listaMesas.set(res.datos as Catalogo[]);
      if(res.success && this.listaMesas().length > 0) {
        if(this.incidente() !== undefined) {
          this.numMro.disable();
          this.numMro.setValue(`${this.incidente()?.num_mro}-${this.incidente()?.tipo_mro}`);
          return;
        }
        this.numMro.enable();
      } else {
        Swal.fire({
          icon:'warning',
          title:'¡Atención!',
          text:'No se encontraron Mesas disponibles para esta Unidad Territorial.',
          allowEscapeKey:false,
          allowOutsideClick:false,
          confirmButtonText:'Entendido'
        });
        this.numMro.disable();
        this.numMro.setValue('');
        this.delegacion.set('');
      }
    })
  }

  activeForm = ():void => {
    this.activar(this.active);
    if(this.incidente() == undefined) {
      this.editar.set(true);
    }
  }

  activar = (active:boolean):void => {
    if(!active) {
      Object.keys(this.incidentesForm.controls).forEach(key => {
        if(!['clave_colonia','num_mro'].includes(key)) {
          this.incidentesForm.get(key)?.disable();
        }
      })
    } else {
      this.incidentesForm.markAsUntouched();
      Object.keys(this.incidentesForm.controls).forEach(key => {
        if(!['clave_colonia','num_mro'].includes(key)) {
          this.incidentesForm.get(key)?.enable();
        }
      })
    }
  }

  closeModal = (submit:boolean | undefined = undefined):void => {
    $('#registIncidentes').modal('hide');
    if(submit) {
      this.reloadLista.emit(true);
    }
    setTimeout(() => {
      this.resetModal.emit(false);
    },400)
  }

  sendIncidente = ():void => {
    this.checkIncidentes();
    if(this.incidentesForm.invalid || this.invalid()) {
      this.incidentesForm.markAllAsTouched();
      Swal.fire({
        icon:'warning',
        title:'¡Formulario inválido!',
        text:'Todos los campos del formulario deben contener los datos solicitados.',
        allowEscapeKey:false,
        allowOutsideClick:false,
        confirmButtonText:'Entendido'
      });
      return;
    }

    Swal.fire({
      icon:'question',
      title:`¿Confirmar ${this.id_incidente() !== undefined ? 'actualización' : 'registro'} del incidente?`,
      allowEscapeKey:false,
      allowOutsideClick:false,
      showCancelButton:true,
      cancelButtonText:'Cancelar',
      confirmButtonText:'Confirmar',
      showLoaderOnConfirm:true,
      preConfirm: async () => {
        const verify = await firstValueFrom(this.verifyService.checkAuthentication());
        if(!verify) return;
        const res = await firstValueFrom(
          this.incidenciasService.saveIncidente(
            this.incidente() !== undefined ?
            {...this.incidentesForm.value as Incidencia, clave_colonia: this.incidente()?.clave_colonia!, id_incidente: this.incidente()?.id_incidente!} :
            this.incidentesForm.value as Incidencia, this.anio()
          )
        );
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
          text: result.value.msg,
          allowEscapeKey:false,
          allowOutsideClick:false,
          showConfirmButton:false,
          timer:1800
        }).then(() => {
          this.closeModal(true);
          this.editar.set(false);
        })
      }
    })
    this.incidenciasService.saveIncidente(this.incidentesForm.value as Incidencia, this.anio());
  }

  activaEditar = ():void => {
    if(this.cierreValidacion()) {
      Swal.fire({
        icon:'error',
        title:'¡No permitido!',
        html:`Ya se ha realizado la conclusión de la validación, <b>no se permite actualizar datos del incidente.</b>`,
        confirmButtonText:'Entendido'
      });
      return;
    }
    this.editar.set(!this.editar());
    this.activar(this.editar());
    if(this.editar()) {
      this.incidentesForm.get('num_mro')?.enable();
    } else {
      this.incidentesForm.get('num_mro')?.disable();
    }
  }

  deleteIncidente = ():void => {
    if(this.cierreValidacion()) {
      Swal.fire({
        icon:'error',
        title:'¡No permitido!',
        html:`Ya se ha realizado la conclusión de la validación, <b>no se permite eliminar incidentes.</b>`,
        confirmButtonText:'Entendido'
      });
      return;
    }
    if(this.rol() !== 1) {
      Swal.fire({
        icon:'warning',
        title:'¡No permitido!',
        html:`Para realizar la eliminación de un incidente se requieren permisos de la <b>Persona Titular de la Dirección Distrital,</b> ¿Desea acceder con su usuario y contraseña?`,
        showCancelButton:true,
        cancelButtonText:'Cancelar',
        confirmButtonText:'Confirmar',
        allowEscapeKey:false,
        allowOutsideClick:false
      }).then((result) => {
        if(result.isConfirmed) {
          this.showModal.set(true);
        }
      });
    } else {
      this.delete();
    }
  }

  //Funcion centralizada para la eliminación del incidente seleccionado por medio del id_incidente proporcionado.
  delete = ():void => {
    Swal.fire({
      icon:'question',
      title:'¿Confirmar eliminación?',
      html:`La eliminación de un incidente es un proceso que <i class="text-danger">no puede ser revertido</i>,<br> <b>¿Desea confirmar?</b>`,
      showCancelButton:true,
      cancelButtonText:'Cancelar',
      confirmButtonText:'Confirmar',
      allowEscapeKey:false,
      allowOutsideClick:false,
      showLoaderOnConfirm:true,
      preConfirm: async () => {
        const verify = await firstValueFrom(this.verifyService.checkAuthentication());
        if(!verify) return;
      const res = await firstValueFrom(this.incidenciasService.deleteIncidente(this.id_incidente()!));
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
          allowEscapeKey:false,
          allowOutsideClick:false,
          timer:2300
        }).then(() => {
          this.closeModal(true);
        })
      }
    })
  }

  //Funciones de retorno de datos provenientes del componente hijo "<main-confirma-accion>".
  getClose = (close:boolean):void => {
    this.showModal.set(close);
  }

  getConfirm = (confirm:boolean):void => {
    if(confirm) {
      this.delete();
    }
  }

  //Verificación de los campos de incidencias.
  checkIncidentes = ():void => {
    if(this.incidente1 || this.incidente2 || this.incidente3 || this.incidente4 || this.incidente5) {
      this.invalid.set(false);
    } else {
      this.invalid.set(true);
    }
  }

  //Funciones de validación del formulario principal.
  isValidField = (field:string):boolean => this.validatorsService.isValidField(this.incidentesForm, field)!;
  getFieldErrors = (field:string):string => this.validatorsService.getFieldError(this.incidentesForm, field);
}

