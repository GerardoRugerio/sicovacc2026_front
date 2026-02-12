import { Component, computed, inject, OnInit, signal} from '@angular/core';

import { DtAttributesService } from '../../../shared/services/dt-attributes.service';
import { VerificaService } from '../../../auth/services/verifica.service';
import { IncidenciasService } from '../../services/incidencias.service';
import { AuthService } from '../../../auth/services/auth.service';

import { Incidencia } from '../../interfaces/incidentes.interface';
import { Config } from 'datatables.net';
import { forkJoin } from 'rxjs';

import Swal from 'sweetalert2';

declare let $:any;

@Component({
  selector: 'main-regist-incidentes-page',
  templateUrl: './regist-incidentes-page.component.html',
  styleUrl: './regist-incidentes-page.component.css'
})

export class RegistIncidentesPageComponent implements OnInit {
  private dtService = inject(DtAttributesService);
  private verifyService = inject(VerificaService);
  private incidenciasService = inject(IncidenciasService);
  private authService = inject(AuthService);

  //Declaración de valores iniciales para el funcionamiento del DataTable.
  public dtOptions:Config = {};

  //Declaración de variables(señales) generales para el funcionamiento de la página principal.
  public listaIncidencias = signal<Incidencia[] | undefined>(undefined);
  public id_incidente = signal<number | undefined>(undefined);
  public anio = signal<number>(0);
  public showModal = signal<boolean>(false);
  public incidente = signal<Incidencia | undefined>(undefined);

  //Obtención del estado del Inicio/Conclusión de la Validación para el control de los registros y edición de incidentes nuevos y existentes.
  private inicioValidacion = computed(() => this.authService.inicioValidacion());
  public cierreValidacion = computed(() => this.authService.cierreValidacion());

  ngOnInit(): void {
    this.dtOptions = this.dtService.dtOptions;
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

  //Activación y desactivación del botón de registro de nuevas incidencias.
  active():boolean {
    if(this.anio() > 0 && this.listaIncidencias() !== undefined) {
      return true;
    } else {
      return false;
    }
  }

  //Entrada de datos por parte de los componentes hijos "<main-save-incidencias>" y "<shared-selector>".
  getAnio = (anio:number):void => {
    this.active();
    this.anio.set(anio);
    if(this.anio() > 0) {
      this.getIncidentes();
    }
  }

  getReset = (reset:boolean):void => {
    this.showModal.set(reset);
    this.incidente.set(undefined);
  }

  getReload = (reload:boolean):void => {
    if(reload) {
      this.getIncidentes();
    }
  }

  getIncidentes = ():void => {
    Swal.fire({
      title:'Espere un momento',
      text:'Cargando lista de Incidencias registradas...',
      allowEscapeKey:false,
      allowOutsideClick:false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    this.listaIncidencias.set(undefined);
    forkJoin({
      verify: this.verifyService.checkAuthentication(),
      res: this.incidenciasService.getListaIncidencias(this.anio())
    }).subscribe(({verify, res}) => {
      if(!verify) return;
      Swal.close();
      this.listaIncidencias.set(res.datos as Incidencia[]);
    })
  }

  getIncidente = (id_incidente:number):Incidencia => this.listaIncidencias()?.find(incidencia => incidencia.id_incidente == id_incidente)!;

  openModal = (id_incidencia:number | undefined = undefined):void => {
    this.id_incidente.set(id_incidencia);
    if(id_incidencia == undefined && this.cierreValidacion()) {
      Swal.fire({
        icon:'error',
        title:'¡No permitido!',
        html:`Ya se ha realizado la conclusión de la validación, <i class="text-danger">no se permite realizar el registro de nuevos incidentes.</i>`,
        confirmButtonText:'Entendido'
      });
      return;
    }
    if(id_incidencia !== undefined) {
      this.incidente.set(this.getIncidente(id_incidencia!));
    }
    this.showModal.set(true);
  }
}
