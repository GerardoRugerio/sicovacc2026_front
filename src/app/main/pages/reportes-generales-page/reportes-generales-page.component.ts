import { Component, inject } from '@angular/core';
import { ReportesGeneralesService } from '../../services/reportes-generales.service';
import Swal from 'sweetalert2';
import { Catalogo } from '../../interfaces/catalogo.inteface';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'main-reportes-generales-page',
  templateUrl: './reportes-generales-page.component.html',
  styleUrl: './reportes-generales-page.component.css'
})
export class ReportesGeneralesPageComponent {
  private reportesService = inject(ReportesGeneralesService);

  public lista_reportes: Catalogo[] = [
    {
      id:'proyectosOpinar',
      nombre:'Proyectos a Opinar.'
    },
    {
      id:'inicioCierreValidacion',
      nombre:'Reporte de asistencia de inicio y cierre de la validación.'
    },
    {
      id:'UTValidadas',
      nombre:'Unidades Territoriales validadas.'
    },
    {
      id:'UTPorValidar',
      nombre:'Unidades Territoriales por validar.'
    },
    {
      id:'listadoProyectos',
      nombre:'F2. Concentrado de Proyectos Participantes por Unidad Territorial.'
    },
    {
      id:'incidentesDistrito',
      nombre:'F3. Incidentes presentados durante la validación de la Consulta.'
    },
    {
      id:'validacionResultados',
      nombre:'F4. Validación de Resultados de la Consulta por Unidad Territorial.',
      tipo:1
    },
    {
      id:'validacionResultadosDetalle',
      nombre:'F5. Validación de Resultados de la Consulta Detalle por Mesa.',
      tipo:1
    },
    {
      id:'MesasConComputo',
      nombre:'F8. Mesas Receptoras de Opinión con Cómputo Capturado.'
    },
    {
      id:'MesasSinComputo',
      nombre:'F9. Mesas Receptoras de Opinión sin Cómputo Capturado.'
    },
    {
      id:'resultadosOpiMesa',
      nombre:'F10. Resultados de Opiniones por Mesa.'
    },
    {
      id:'proyectosPrimerLugar',
      nombre:'F11. Proyectos por Unidad Territorial que Obtuvieron el Primer Lugar.'
    },
    {
      id:'proyectosEmpatePrimerLugar',
      nombre:'F13. Casos de empates de los proyectos que obtuvieron el primer lugar.'
    },
    {
      id:'proyectosUTSinOpiniones',
      nombre:'F15. Concentrado de Unidades Territoriales que no recibieron opiniones.'
    },
    {
      id:'levantadaDistrito',
      nombre:'Actas Levantadas en Dirección Distrital (causales de recuento).'
    },
  ]

  private clave_colonia:string | undefined = undefined;
  private anio:number = 0;

  getAnio = (anio:number):void => {
    this.anio = anio;
  }

  downloadReports = (params:string, post:boolean | undefined = undefined):void => {
    if(this.anio !== 0) {
      Swal.fire({
        title:'Espere un momento',
        text:'Obteniendo datos para generar el reporte...',
        allowEscapeKey:false,
        allowOutsideClick:false,
        didOpen: () => {
          Swal.showLoading();
        }
      });
      this.reportesService.downloadReporte(this.anio,params, this.clave_colonia, post)
      .subscribe(res => {
        Swal.close();
        if(res.success) {
          const blob = new Blob([new Uint8Array(res.buffer!.data)], { type: res.contentType });
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
    } else {
      Swal.fire({
        icon:'error',
        title:'¡No permitido!',
        text:'Para descargar algún reporte se requiere seleccionar el año de consulta.',
        allowEscapeKey:false,
        allowOutsideClick:false,
        confirmButtonText:'Entendido'
      })
    }
  }
}
