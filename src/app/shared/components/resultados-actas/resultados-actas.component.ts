import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { VerificaService } from '../../../auth/services/verifica.service';
import { CatalogosService } from '../../../main/services/catalogos.service';
import { ReportesGeneralesService } from '../../../main/services/reportes-generales.service';

import { Catalogo } from '../../../main/interfaces/catalogo.inteface';
import { forkJoin } from 'rxjs';

import Swal from 'sweetalert2';

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
      nombre:
        'F4. Validación de Resultados de la Consulta por Unidad Territorial.',
    },
    {
      id: 'validacionResultadosDetalle',
      nombre: 'F5. Validación de Resultados de la Consulta Detalle Mesa.',
    },
    {
      id: 'validacionResultadosNombre',
      nombre:
        'F6. Validación de Resultados de la Consulta por Nombre de Proyecto.',
    },
    {
      id: 'validacionResultadosNombreDetalle',
      nombre:
        'F7. Validación de Resultados de la Consulta por Nombre de Proyecto (Detalle por Mesa).',
    },
  ];

  //Atributos para los botones de descarga de constancias/reporte de proyectos.
  public listaConstancias: Catalogo[] = [
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
  ];


  ngOnInit(): void {
    this.claveColonia.disable();
  }

  //Obtención del valor del tipo/año de consulta proveniente del componente hijo "<shared-selector>".
  getAnio = (anio:number):void => {
    this.anio.set(+anio);
    if(this.anio() > 0) {
      this.getColonias();
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
    const params = ['WORD','PDF'].includes(path) ? 'actaValidacion' : path;
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

    Swal.fire({
      title:'Espere un momento',
      html:`Obteniendo datos para generar el <b>${params !== 'actaValidacion' ? 'reporte' : 'acta de validación'}</b>...`,
      allowEscapeKey:false,
      allowOutsideClick:false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    this.reportesService.downloadProyectosP(this.anio(), params, this.clave, ['WORD','PDF'].includes(path) ? path : undefined)
    .subscribe(res => {
      Swal.close();
      if (res.success) {
        const blob = new Blob([new Uint8Array(res.buffer.data)], { type: res.contentType });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = res.reporte;
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
