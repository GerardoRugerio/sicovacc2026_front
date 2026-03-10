import { AfterViewInit, Component, computed, inject, OnInit, signal } from '@angular/core';
import { Config } from 'datatables.net';

import { DbStatusService } from '../../../auth/services/db-status.service';
import { VerificaService } from '../../../auth/services/verifica.service';
import { AuthService } from '../../../auth/services/auth.service';
import { ActasService } from '../../services/actas.service';
import { DtAttributesService } from '../../../shared/services/dt-attributes.service';
import { Status } from '../../../auth/interfaces/database-status.interface';

import { Acta, Datos } from '../../interfaces/captura_resultados_actas.interface';
import { forkJoin } from 'rxjs';

import Swal from 'sweetalert2';

@Component({
  selector: 'main-captura-actas-mesa-page',
  templateUrl: './captura-actas-mesa-page.component.html',
  styleUrl: './captura-actas-mesa-page.component.css'
})
export class CapturaActasMesaPageComponent implements OnInit, AfterViewInit {
  private verifyService = inject(VerificaService);
  private actasService = inject(ActasService);
  private dtService = inject(DtAttributesService);
  private authService = inject(AuthService);
  private dbStatusService = inject(DbStatusService);

  //Declaración de variables y arreglos(señales) para la operación de la página principal.
  public anio = signal<number>(0);
  public data = signal<Datos | undefined>(undefined);
  public listaActas = signal<Acta[] | undefined>(undefined);
  public acta = signal<Acta | undefined>(undefined);
  public showModal = signal<boolean>(false);
  public id_acta = signal<number | undefined>(undefined);
  public dataStatus = signal<Status | undefined>(undefined);

  //Declaración de variable para obtención de propiedades del DataTable.
  public dtOptions: Config = {};

  //Obtención de estatus del Inicio/Cierre de la Validación.
  public inicioValidacion = computed(() => this.authService.inicioValidacion());
  public cierreValidacion = computed(() => this.authService.cierreValidacion());

  ngOnInit(): void {
    this.dtOptions = this.dtService.dtOptions;
  }

  ngAfterViewInit():void {
    this.getStatus();
  }

  //Centralización de los mensajes de espera de la página principal.
  private message = (text:string):void => {
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

  //Funciones de retorno de datos provenientes de los componentes hijos "<shared-selector>" y "<main-captura-actas>".
  getAnio = (anio:number):void => {
    this.anio.set(anio);
    this.listaActas.set(undefined);
    this.id_acta.set(undefined);
    if(this.anio() > 0) {
      this.getActas();
    }
  }

  getReset = (reset:boolean):void => {
    this.showModal.set(reset);
  }

  getReload = (reload:boolean):void => {
    if(reload) {
      this.getActas();
    }
  }

  getStatus = ():void => {
    if(this.dbStatusService.status() !== undefined) {
      this.dataStatus.set(this.dbStatusService.status());
    } else {
      this.dbStatusService.getDatosStatus()
      .subscribe(res => {
        this.dbStatusService.status.set(res.datos as Status);
        this.dataStatus.set(this.dbStatusService.status());
      })
    }
  }

  getActas = ():void => {
    this.listaActas.set(undefined);
    this.message('Cargando lista de Actas registradas...');
    this.acta.set(undefined);
    forkJoin({
      verify: this.verifyService.checkAuthentication(),
      res: this.actasService.getActas(this.anio())
    }).subscribe(({verify, res}) => {
      if(!verify) return;
      Swal.close();
      this.data.set(res.datos as Datos);
      this.listaActas.set(this.data()?.actas);
    })
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

  openModal = (id_acta:number | undefined = undefined):void => {
    this.id_acta.set(id_acta);
    if(!this.dataStatus()?.datosSEI && this.id_acta() == undefined) {
      Swal.fire({
        icon:'error',
        title:'¡No permitido!',
        html:`No se ha realizado la importación de los datos SEI, por lo tanto no se permiten capturas de actas.`,
        confirmButtonText:'Entendido'
      })
      return;
    }

    if(this.cierreValidacion() && this.id_acta() == undefined) {
      Swal.fire({
        icon:'error',
        title:'¡No permitido!',
        html:`Ya se ha realizado la conclusión de la validación, por lo tanto, <i class="text-danger">no se permiten nuevas capturas de actas.</i>`,
        confirmButtonText:'Entendido'
      });
      return;
    }

    if(this.id_acta() == undefined && this.data()?.actasPorCapturar == 0) {
      Swal.fire({
        icon:'warning',
        title:'¡No hay más actas!',
        html:`Ya se han capturado todas las actas disponibles para este año/tipo de consulta.`,
        confirmButtonText:'Entendido'
      });
      return;
    }
    this.showModal.set(true);
  }
}
