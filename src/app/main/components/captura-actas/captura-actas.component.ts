import { AfterViewInit, Component, computed, inject, input, OnInit, output, signal } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { ActasService } from '../../services/actas.service';
import { AuthService } from '../../../auth/services/auth.service';
import { Catalogo } from '../../interfaces/catalogo.inteface';
import { CatalogosService } from '../../services/catalogos.service';
import { DbStatusService } from '../../../auth/services/db-status.service';
import { EncryptService } from '../../../shared/services/encrypt.service';
import { ValidatorsService } from '../../../shared/services/validators.service';
import { VerificaService } from '../../../auth/services/verifica.service';

import { Acta, Integraciones } from '../../interfaces/captura_resultados_actas.interface';
import { Status } from '../../../auth/interfaces/database-status.interface';

import { firstValueFrom, forkJoin } from 'rxjs';
import Swal from 'sweetalert2';

declare let $:any;

const message = (text:string):void => {
  Swal.fire({
    title:'Espere un momento',
    html:text,
    allowEscapeKey:false,
    allowOutsideClick:false,
    didOpen: () => {
      Swal.showLoading();
    }
  });
}

@Component({
  selector: 'main-captura-actas',
  templateUrl: './captura-actas.component.html',
  styleUrl: './captura-actas.component.css'
})
export class CapturaActasComponent implements OnInit, AfterViewInit {
  private fb = inject(FormBuilder);
  private actasService = inject(ActasService);
  private verifyService = inject(VerificaService);
  private validatorsService = inject(ValidatorsService);
  private catalogosService = inject(CatalogosService);
  private authService = inject(AuthService);
  private dbStatusService = inject(DbStatusService);
  private encryptService = inject(EncryptService);

  //Declaración del formulario reactivo para el funcionamiento del componente.
  public actasForm:FormGroup = this.fb.group({
    nombre_delegacion:[''],
    clave_colonia: ['', [Validators.required]],
    num_mro: ['', [Validators.required]],
    num_integrantes: [''],
    levantada_distrito: [false],
    coordinador_sino: [false],
    observador_sino: [false],
    bol_recibidas: ['', [Validators.required]],
    bol_adicionales: ['', [Validators.required]],
    bol_sobrantes: ['', [Validators.required]],
    total_ciudadanos: ['', [Validators.required]],
    bol_nulas: ['', [Validators.required]],
    razon_distrital: [''],
    integraciones: this.fb.array([])
  });

  //Obtención de cada uno de los campos del formulario.
  get claveColonia():FormControl {return this.actasForm.get('clave_colonia') as FormControl};
  get numMro():FormControl {return this.actasForm.get('num_mro') as FormControl};
  get numIntegrantes():FormControl {return this.actasForm.get('num_integrantes') as FormControl};
  get levantadaDistrito():FormControl {return this.actasForm.get('levantada_distrito') as FormControl};
  get coordinadorSiNo():FormControl {return this.actasForm.get('coordinador_sino') as FormControl};
  get observadorSiNo():FormControl {return this.actasForm.get('observador_sino') as FormControl};
  get bolRecibidas():FormControl {return this.actasForm.get('bol_recibidas') as FormControl};
  get bolAdicionales():FormControl {return this.actasForm.get('bol_adicionales') as FormControl};
  get bolSobrantes():FormControl {return this.actasForm.get('bol_sobrantes') as FormControl};
  get bolNulas():FormControl {return this.actasForm.get('bol_nulas') as FormControl};
  get totalCiudadanos():FormControl {return this.actasForm.get('total_ciudadanos') as FormControl};
  get razonDistrital():FormControl {return this.actasForm.get('razon_distrital') as FormControl};

  //Obtención del FormArray por separado.
  get listaIntegraciones():FormArray {return this.actasForm.get('integraciones') as FormArray};

  //Obtención de los valores de los campos del formulario.
  get clave():string {return this.claveColonia.value};
  get numMesa():number {return this.numMro.value.split('-')[0]};
  get tipoMesa():number {return this.numMro.value.split('-')[1]};
  get integrantes():number {return this.numIntegrantes.value};
  get levDistrito():boolean {return this.levantadaDistrito.value};
  get coordinador():boolean {return this.coordinadorSiNo.value};
  get observador():boolean {return this.observadorSiNo.value};
  get recibidas():number {return this.bolRecibidas.value};
  get adicionales():number {return this.bolAdicionales.value};
  get sobrantes():number {return this.bolSobrantes.value};
  get nulas():number {return this.bolNulas.value};
  get ciudadanos():number {return this.totalCiudadanos.value};
  get razonDis():string {return this.razonDistrital.value};

  //Obtención de valores totales de la suma de votos en mesa y SEI.
  get totalNulasMesaSEI():number {return +this.nulas + +this.datos()?.bol_nulas_sei!};
  get totalEmitida():number {return +this.sumaVotos() + +this.nulas};
  get totalEmitidaMesaSEI():number {return +this.totalEmitida + +this.datos()?.opi_total_sei!};
  get totalVotosMesaSEI():number {return this.sumaVotos()};
  get totalEfectivaMesaSEI():number {return +this.sumaVotos() + +this.sumaVotosSEI()};

  //Declaración de inputs y outputs de datos que se moverán entre el componente padre y el componente hijo.
  //Entrada de datos.
  public inputAnio = input<number>();
  public id = input<number | undefined>();

  //Salida de datos.
  public reset = output<boolean>();
  public reload = output<boolean>();

  //Declaración de variables(señales) de funcionamiento del formulario.
  public anio = signal<number>(0);
  public listaIntegrantes = signal<Catalogo[]>([]);
  public listaColonias = signal<Catalogo[] | undefined>(undefined);
  public listaMesas = signal<Catalogo[] | undefined>(undefined);
  public delegacion = signal<string>('');
  public datos = signal<Acta | undefined>(undefined);
  public editForm = signal<boolean>(false);
  public showModal = signal<boolean>(false);
  public id_acta = signal<number | undefined>(undefined);
  public nMesa = signal<string>('');
  public cColonia = signal<string>('');
  private totalCapturadas = signal<number>(0);

  //Obtención de datos de Inicio/Conclusión de la Validación y el tipo de rol del usuario en sesión.
  public inicioValidacion = computed(() => this.authService.inicioValidacion());
  public cierreValidacion = computed(() => this.authService.cierreValidacion());
  public rol = computed(() => this.authService.rol());


  ngOnInit(): void {
    this.actasForm.disable();
    for(let i = 1; i < 10; i++) {
      this.listaIntegrantes().push({id:i.toString(), nombre: i.toString()});
    }
    $('#capturaActas').modal('show');
    this.id_acta.set(this.id());
  }

  ngAfterViewInit(): void {
    if(this.id_acta() !== undefined) {
      this.getDatosActa();
    }
  }

  block = (event:KeyboardEvent):void => {
    if(event.key == 'ArrowUp' || event.key == 'ArrowDown') {
      event.preventDefault();
    }
  }

  limitNumbers = (event:any):boolean => {
    const key = event.charCode;
    if(key !== 8 || key !== 9) {
      let max = 4;
      if((key < 48 || key > 57 || event.target.value.length >= max)) return false;
    }
    return true;
  }

  next = (event:any, id:string):void => {   0
    const key = event.keyCode;
    if(key == 13) {
      if(id !== 'submit') {
        $(`#${id}`).select();
      } else {
        this.sendDatos();
      }
    }
  }

  sumaVotos = ():number => this.listaIntegraciones.controls.reduce((sum, group) => {
    const votos = +group.get('votos')?.value;
    return sum + +votos;
  },0);

  sumaVotosSEI = ():number => this.listaIntegraciones.controls.reduce((sum, group) => {
    const votos = +group.get('votos_sei')?.value;
    return sum + votos;
  },0);

  getTextos = (tipo:number):string[] => {
    switch(+tipo) {
      case 1:
        return ['Total de personas que emitieron su opinión','Boletas de opinión recibidas','',''];
      case 2:
        return ['Total de personas que emitieron su opinión','Boletas de opinión recibidas','',''];
      case 3:
        return ['Total de personas en estado de postración que emitieron su opinión','Número de sobres recibidos','(MECPEP)','(Personas en Estado de Postración)'];
      case 4:
        return ['Total de personas en prisión preventiva que emitieron su opinión','Número de sobres recibidos','(MECPPP)','(Personas en Prisión Preventiva)'];
      default:
        return [''];
    }
  }

  patchFieldsTipoMesa = (tipo:number | undefined = undefined):void => {
    switch(+this.tipoMesa || tipo) {
      case 3:
        this.bolAdicionales.setValue('0');
        this.bolSobrantes.setValue('0');
      break;
      case 4:
        this.bolAdicionales.setValue('0');
        this.bolSobrantes.setValue('0');
      break;
      default:
        this.bolRecibidas.setValue('');
        this.bolAdicionales.setValue('');
        this.bolSobrantes.setValue('');
        this.totalCiudadanos.setValue('');
      break;
    }
  }

  resetFields = ():void => {
    this.claveColonia.setValue('');
    this.numMro.setValue('');
    this.claveColonia.disable();
    this.numMro.disable();
    this.actasForm.markAsUntouched();
    this.listaIntegraciones.clear();
    this.datos.set(undefined);
    this.delegacion.set('');
  }

  getAnio = (anio:number):void => {
    if(anio !== this.anio() && this.cColonia() !== '') {
      this.id_acta.set(undefined);
      this.editForm.set(false);
    }
    this.anio.set(anio);
    this.resetFields();
    if(this.anio() > 0 && this.id_acta() == undefined) {
      this.getColonias();
    }
  }

  verifyCapturas = (verify:boolean = false):void => {
    if(verify) {
      this.dbStatusService.getDatosStatus()
      .subscribe(res => {
        this.dbStatusService.status.set(res.datos as Status);
      });
      return;
    }

    this.totalCapturadas.set(this.dbStatusService.status()?.conteo.conteo_C.actasCapturadas! + this.dbStatusService.status()?.conteo.conteo_CC1.actasCapturadas! +
    this.dbStatusService.status()?.conteo.conteo_CC2.actasCapturadas!);
    if(this.totalCapturadas() == 0) {
      Swal.fire({
        icon:'info',
        title:'¡Atención!',
        html:'Verificar si ya fueron marcadas todas las <span class="text-primary">MESAS NO INSTALADAS</span>, <i class="text-danger">¡ya que no se podrán marcar/desmarcar una vez iniciada la captura de actas!</i>',
        allowEscapeKey:false,
        allowOutsideClick:false,
        confirmButtonText:'Entendido'
      });
    }
  }

  getDatosActa = ():void => {
    message('Cargando datos del acta...');
    forkJoin({
      verify: this.verifyService.checkAuthentication(),
      res: this.actasService.getActa(this.anio(),this.id_acta()!)
    }).subscribe(({verify, res}) => {
      if(!verify) return;
      Swal.close();
      this.datos.set(res.datos as Acta);
      this.actasForm.patchValue(this.datos()!);
      this.patchIntegraciones(this.datos()?.integraciones as Integraciones[]);
      this.listaIntegraciones.disable();
    })
  }

  getColonias = ():void => {
    this.resetForm();
    message('Cargando lista de Unidades Territoriales disponibles para el año/tipo de consulta seleccionado...');
    this.claveColonia.setValue('');
    this.claveColonia.disable();
    this.claveColonia.markAsUntouched();
    this.listaIntegraciones.clear();
    forkJoin({
      verify: this.verifyService.checkAuthentication(),
      res: this.catalogosService.getCatalogo('coloniasSinActas','', this.anio())
    }).subscribe(({verify, res}) => {
      if(!verify) return;
      Swal.close();
      if(!res.success) {
        Swal.fire({
          icon:'warning',
          title:'¡Atención!',
          text:'No se encontraron Unidades Territoriales disponibles para este año/tipo de consulta',
          confirmButtonText:'Entendido'
        });
         this.claveColonia.disable();
        return;
      }
      this.listaColonias.set(res.datos as Catalogo[]);
      this.claveColonia.enable();
      this.verifyCapturas();
    })
  }

  getMesas = ():void => {
    this.numMro.setValue('');
    this.numMro.disable();
    this.numMro.markAsUntouched();
    this.listaIntegraciones.clear();
    this.resetForm();
    this.delegacion.set('');
    if(this.clave !== '') {
      message('Cargando lista de Mesas disponibles para esta Unidad Territorial...');
      forkJoin({
        verify: this.verifyService.checkAuthentication(),
        delegacion: this.catalogosService.getCatalogo('delegacion',this.clave),
        res: this.catalogosService.getCatalogo('mesasSinActas',this.clave, this.anio())
      }).subscribe(({verify, delegacion, res}) => {
        if(!verify) return;
        Swal.close();
        if(!res.success && this.clave !== '') {
          Swal.fire({
            icon:'warning',
            title:'¡Atención!',
            text:'No se encontraron Unidades Territoriales disponibles para este año/tipo de consulta',
            confirmButtonText:'Entendido'
          });
           this.numMro.disable();
          return;
        }
        this.delegacion.set(delegacion.delegacion);
        this.listaMesas.set(res.datos as Catalogo[]);
        this.numMro.enable();
      })
    }
  }

  getIntegraciones = ():void => {
    this.listaIntegraciones.clear();
    this.resetForm();
    this.patchFieldsTipoMesa();
    if(this.numMesa > 0) {
      this.activaIntegrantes();
      message('Cargando lista de integraciones para esta acta...');
      forkJoin({
        verify: this.verifyService.checkAuthentication(),
        res: this.actasService.getDatos(this.anio(),this.clave, this.numMesa, this.tipoMesa)
      }).subscribe(({verify, res}) => {
        if(!verify) return;
        Swal.close();
        if(!res.success) {
          Swal.fire({
            icon:'warning',
            title:'¡Atención!',
            text:'No se encontraron datos para el acta seleccionada.',
            confirmButtonText:'Entendido'
          });
          return;
        };
        this.actasForm.enable();
        this.numIntegrantes.disable();
        this.datos.set(res.datos as Acta);
        this.patchIntegraciones(this.datos()?.integraciones as Integraciones[]);
      })
    }
  }

  patchIntegraciones = (integraciones:Integraciones[]) => integraciones.forEach(integracion => this.listaIntegraciones.push(this.fb.group({
    secuencial:[integracion.secuencial],
    nom_p:[integracion.nom_p],
    rubro_general:[integracion.rubro_general],
    votos:[integracion.votos, [Validators.required]],
    votos_sei:[integracion.votos_sei]
  })));

  sendDatos = ():void => {
    if(this.actasForm.invalid) {
      Swal.fire({
        icon:'warning',
        title:'¡Atención!',
        html:`Todos los campos marcados como obligatorios deben contener los datos requeridos.`,
        allowEscapeKey:false,
        allowOutsideClick:false,
        confirmButtonText:'Entendido'
      });
      this.actasForm.markAllAsTouched();
      return;
    }

    if(!this.levDistrito && (this.tipoMesa <= 2 || this.datos()?.tipo_mro! <= 2)) {
      if(+this.nulas > +this.sumaVotos()) {
        Swal.fire({
          icon:'warning',
          title:'¡Atención!',
          html:`El número de ${this.anio() < 2 ? 'votos' : 'opiniones'} nul${this.anio() < 2 ? 'o' : 'a'}s es mayor a ${this.anio() < 2 ? ' los votos' : ' las opiniones'}
          válid${this.anio() < 2 ? 'o' : 'a'}s,<br><b>¿Desea Levantar el Acta en Dirección Distrital?</b>`,
          allowEscapeKey:false,
          allowOutsideClick:false,
          showCancelButton:true,
          cancelButtonText:'No',
          confirmButtonText:'Sí',
        }).then((result) => {
          if(result.isConfirmed) {
            this.levantadaDistrito.setValue(true);
            this.activaLevantadaDis(true);
          } else {
            this.saveActa(true, 3, this.id_acta());
          }
        })
        return;
      }

      if(+this.recibidas + +this.adicionales !== +this.sobrantes + +this.nulas + +this.sumaVotos()) {
        Swal.fire({
          icon:'warning',
          title:'¡Atención!',
          html:`El número de boletas sobrantes más los resultados de la ${this.anio() < 2 ? 'votación' : 'opinión'} en Mesa <b>"no es igual"</b> a las boletas entregadas.
          (No Incluye Datos SEI), <b>¿Desea Levantar el Acta en Dirección Distrital?</b>`,
          allowEscapeKey:false,
          allowOutsideClick:false,
          showCancelButton:true,
          cancelButtonText:'No',
          confirmButtonText:'Sí',
        }).then((result) => {
          if(result.isConfirmed) {
            this.levantadaDistrito.setValue(true);
            this.activaLevantadaDis(true);
          } else {
            this.saveActa(true, 2, this.id_acta());
          }
        })
        return;
      }
    }

    this.saveActa(false, undefined, this.id_acta());
  }

  saveActa = (forzar:boolean, id_incidencia:number | undefined = undefined, id_acta:number | undefined = undefined):void => {
    Swal.fire({
      icon:'question',
      title:`¿Confirmar ${this.id_acta() !== undefined ? 'actualización' : 'captura'}?`,
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
          this.actasService.saveDatos(
              this.actasForm.value as Acta,
              this.anio(),
              this.sumaVotos() + +this.nulas,
              this.datos()?.opi_total_sei!,
              forzar,
              id_incidencia,
              id_acta
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
        if(this.id_acta() == undefined) {
          this.id_acta.set(this.encryptService.decrypt(result.value.id_acta));
        }
        Swal.fire({
          icon:'success',
          title:'¡Correcto!',
          text:result.value.msg,
          showConfirmButton:false,
          timer:2300
        }).then(() => {
          if(result.value.success) {
            const total = this.dbStatusService.status()?.conteo.conteo_C.actasCapturadas! + this.dbStatusService.status()?.conteo.conteo_CC1.actasCapturadas! +
            this.dbStatusService.status()?.conteo.conteo_CC2.actasCapturadas!;
            if(total == 0) {
              this.verifyCapturas(true);
            }
            this.actasForm.disable();
            const textCol = this.listaColonias()?.find(col => col.id == this.clave);
            this.cColonia.set(`${textCol?.nombre} (${this.clave})`);
            const textMesa = this.listaMesas()?.find(mesa => mesa.id == String(this.numMesa));
            this.nMesa.set(`${textMesa?.nombre} ${this.getTextos(this.tipoMesa)[2]}`)
            this.editForm.set(false);
          }
        })
       }
    })
  }

  edit = ():void => {
    this.editForm.set(!this.editForm());
    if(this.editForm()) {
      Object.keys(this.actasForm.controls).forEach(key => {
        this.actasForm.get(key)?.enable();
      })
    } else {
      Object.keys(this.actasForm.controls).forEach(key => {
        this.actasForm.get(key)?.disable();
      })
    }
    this.activaIntegrantes(true);
    this.activaLevantadaDis();
  }

  activaLevantadaDis = (reset:boolean | undefined = undefined):void => {
    this.razonDistrital.markAsUntouched();
    if(this.levDistrito) {
      this.razonDistrital.setValidators([Validators.required]);
      this.bolRecibidas.setValue('0');
      this.bolAdicionales.setValue('0');
      this.bolSobrantes.setValue('0');
    } else {
      this.razonDistrital.clearValidators();
      this.bolRecibidas.markAsUntouched();
      this.bolAdicionales.markAsUntouched();
      this.bolSobrantes.markAsUntouched();
      if(reset) {
        this.bolRecibidas.setValue('');
        this.bolAdicionales.setValue('');
        this.bolSobrantes.setValue('');
        this.razonDistrital.setValue('');
      }
    }
  }

  activaIntegrantes = (enable:boolean | undefined = undefined):void => {
    this.numIntegrantes.markAsUntouched();
    if(this.coordinador) {
      this.numIntegrantes.setValidators([Validators.required]);
      if(!enable) {
        this.numIntegrantes.enable();
      }
    } else {
      this.numIntegrantes.disable();
      this.numIntegrantes.clearValidators();
      this.numIntegrantes.setValue('');
    }
  }

  activaEdit = ():void => {
    if(this.rol() !== 1) {
      Swal.fire({
        icon:'warning',
        title:'¡No permitido!',
        html:`Para actualizar la información de un acta se requieren permisos de la <b>Persona Titular de la Dirección Distrital,</b> ¿Desea acceder con su usuario y contraseña?`,
        allowEscapeKey:false,
        allowOutsideClick:false,
        showCancelButton:true,
        cancelButtonText:'Cancelar',
        confirmButtonText:'Acceder',
      }).then((result) => {
        if(result.isConfirmed) {
          this.showModal.set(true);
        }
      });
    } else {
      this.getConfirm(true);
    }
  }

  getConfirm = (confirm:boolean) => {
    if(confirm) {
      this.edit();
    }
  }

  getReset = (reset:boolean):void => {
    this.showModal.set(reset);
  }

  resetForm = ():void => {
    this.levantadaDistrito.setValue(false);
    this.coordinadorSiNo.setValue(false);
    this.numIntegrantes.setValue('');
    this.observadorSiNo.setValue(false);
    this.bolRecibidas.setValue('');
    this.bolAdicionales.setValue('');
    this.bolSobrantes.setValue('');
    this.totalCiudadanos.setValue('');
    this.bolNulas.setValue('');
    this.actasForm.markAsUntouched();
  }

  closeModal = ():void => {
    $('#capturaActas').modal('hide');
    if(this.cColonia() !== '') {
      this.reload.emit(true);
    }
    setTimeout(() => {
      this.reset.emit(false);
    },400);
  }

  //Funciones de validación del formulario principal.
  isValid = (field:string):boolean => this.validatorsService.isValidField(this.actasForm, field)!;
  isValidVotosField = (field:string, position:number,form_field:string):boolean => this.validatorsService.isValidVotosField(this.actasForm, field, String(position), form_field);
  getFieldErrors = (field:string):string => this.validatorsService.getFieldError(this.actasForm,field);
  getVotosFieldErrors = (field:string, position:number, formField:string):string => this.validatorsService.getFieldVotosErrors(this.actasForm, field,String(position), formField)!;
}
