import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { VerificaService } from '../../../auth/services/verifica.service';
import { CatalogosService } from '../../../main/services/catalogos.service';
import { ReportesGeneralesService } from '../../../main/services/reportes-generales.service';

import { Catalogo } from '../../../main/interfaces/catalogo.inteface';
import { forkJoin } from 'rxjs';

import Swal from 'sweetalert2';
import { WebsocketService } from '../../services/websocket.service';

@Component({
  selector: 'shared-resultados-actas',
  templateUrl: './resultados-actas.component.html',
  styleUrl: './resultados-actas.component.css',
})
export class ResultadosActasComponent implements OnInit {
  private fb = inject(FormBuilder);
  private verifyService = inject(VerificaService);
  private catalogosService = inject(CatalogosService);
  private reportesService = inject(ReportesGeneralesService);
  private webSocketService = inject(WebsocketService);

  //Declaración del formulario principal.
  public constanciasForm: FormGroup = this.fb.group({
    clave_colonia: ['', [Validators.required]],
  });

  //Obtención del campo del formulario y su valor para posterior manipulación.
  private get claveColonia():FormControl {return this.constanciasForm.get('clave_colonia') as FormControl};
  private get clave():string {return this.claveColonia.value};

  //Variable de activación/desactivación de los botones de descarga de los reportes/constancias de la página principal.
  get active():boolean {return this.clave! !== '' ? true : false};

  //Declaración variables para el funcionamiento de la página de reportes y contrancias.
  public listaColonias = signal<Catalogo[]>([]);
  public anio = signal<number>(0);

  //Arreglo de objetos para iteración de los reportes disponibles para descarga.
  public listaReportes: Catalogo[] = [
    {
      id: 'validacionResultados',
      nombre: 'Validación de Resultados de la Consulta por Unidad Territorial.',
    },
    {
      id: 'validacionResultadosDetalle',
      nombre: 'Validación de Resultados de la Consulta Detalle Mesa.',
    },
    {
      id: 'validacionResultadosNombre',
      nombre: 'Validación de Resultados de la Consulta por Nombre de Proyecto.',
    },
    {
      id: 'validacionResultadosNombreDetalle',
      nombre: 'Validación de Resultados de la Consulta por Nombre de Proyecto (Detalle por Mesa).',
    },
  ];

  private mockConstancias: Catalogo[] = [
    {
      id: 'proyectosParticipantes',
      nombre: 'Proyectos participantes dictaminados favorablemente',
    },
    {
      id: 'WORD',
      nombre: 'Acta',
    },
    {
      id: 'PDF',
      nombre: 'Acta',
    },
    {
      id: 'actasComputoTotalZip',
      nombre: 'Descargar todo (.zip)'
    },
    {
      id: 'actasValidacionZip',
      nombre: 'Descargar todo (.zip)'
    },
  ];

  //Atributos para los botones de descarga de constancias/reporte de proyectos.
  public listaConstancias: Catalogo[] = [];


  ngOnInit(): void {
    this.claveColonia.disable();
    this.webSocketService.listen('descarga-zip')
    .subscribe(res => {
      const { fase, porcentaje } = res as {fase: 'generando' | 'comprimiendo', porcentaje: number};
      document.getElementById('progress-title')!.innerHTML = fase == 'generando' ? `Generando las <b>Actas de ${this.anio() == 1 ? 'Cómputo Total' : 'Validación'}</b>` : `Comprimiendo el ZIP`;
      document.getElementById('progress-bar')!.style.width = `${porcentaje}%`;
      document.getElementById('progress-text')!.innerHTML = `${porcentaje}%`;
    })
  }

  //Obtención del valor del tipo/año de consulta proveniente del componente hijo "<shared-selector>".
  getAnio = (anio:number):void => {
    this.anio.set(+anio);
    if(this.anio() > 0) {
      this.getColonias();
      this.anio() == 1 ?
      this.listaConstancias = this.mockConstancias.filter(constancia => constancia.id !== 'actasValidacionZip') :
      this.listaConstancias = this.mockConstancias.filter(constancia => constancia.id !== 'actasComputoTotalZip')
    } else {
      this.listaColonias.set([]);
      this.claveColonia.setValue('');
      this.claveColonia.disable();
    }
  }

  getTipo = ():string => {
    if(this.anio() == 1) {
      return 'de Cómputo Total';
    } else {
      return 'de Validación';
    }
  }

  getColonias = ():void => {
    this.claveColonia.setValue('');
    this.listaColonias.set([]);
    this.claveColonia.disable();
    Swal.fire({
      title:'Espere un momento',
      text:'Cargando lista de Unidades Territoriales disponibles...',
      allowEscapeKey:false,
      allowOutsideClick:false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    forkJoin({
      verify: this.verifyService.checkAuthentication(),
      res: this.catalogosService.getCatalogo('coloniasConActas',undefined, this.anio())
    }).subscribe(({verify, res}) => {
      Swal.close();
      if(!verify) return;
      if(res.datos !== undefined && res.success) {
        this.listaColonias.set(res.datos as Catalogo[]);
        this.claveColonia.enable();
      } else {
        this.claveColonia.disable();
        Swal.fire({
          icon:'warning',
          title:'¡Atención!',
          text:`No se han encontrado Unidades Territoriales con ${this.anio() < 2 ? 'Cómputo' : 'Validaciones'} capturad${this.anio() < 2 ? 'o': 'as'} para este año/tipo de consulta`,
          allowEscapeKey:false,
          allowOutsideClick:false,
          confirmButtonText:'Entendido'
        });
      }
    })
  }

  download = (path:string):void => {
    const params = ['WORD','PDF'].includes(path) ? (this.anio() == 1 ? 'actaComputoTotal' : 'actaValidacion') : path;
    if(this.anio() == 0) {
      Swal.fire({
        icon:'error',
        title:'¡No permitido!',
        text:'No se permite la descarga de ningún reporte sin haber seleccionado un tipo de consulta/eleccion.',
        allowEscapeKey:false,
        allowOutsideClick:false,
        confirmButtonText:'Entendido'
      });
      return;
    }

    if(!params.includes('Zip'))
      Swal.fire({
          title: 'Espera un momento',
          html: `Obteniendo datos para generar el <b>${['actaValidacion', 'actaComputoTotal'].includes(params) ? (this.anio() == 1 ? 'Acta de Cómputo Total' : 'Acta de Validación') : 'reporte'}</b>`,
          allowEscapeKey: false,
          allowOutsideClick: false,
          didOpen: () => Swal.showLoading()
      });
    else
      Swal.fire({
          title: 'Espere un momento',
          html: `<span id="progress-title"></span>
          <div style="width: 100%; background: #eee; border-radius: 15px;">
            <div id="progress-bar" style="
              width: 0%;
              height: 20px;
              background: #350072;
              border-radius: 15px;
              transition: width 0.2s;
            "></div>
          </div>
          <p id="progress-text">0%</p>`,
          allowEscapeKey: false,
          allowOutsideClick: false,
          didOpen: () => Swal.showLoading()
      });

    this.reportesService.downloadProyectosP(this.anio(), params, this.clave, ['WORD','PDF'].includes(path) ? path : undefined)
    .subscribe(res => {
      Swal.close();
      if (res.success) {
        const blob = new Blob([new Uint8Array(res.buffer.data)], { type: res.contentType });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = res.reporte! ?? res.archivo!;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        Swal.fire({
          icon:'warning',
          title:'¡No se realizó la descarga!',
          text: res.msg,
          confirmButtonText:'Entendido',
        })
      }
    })
  };
}
