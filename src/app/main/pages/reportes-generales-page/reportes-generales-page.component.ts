import { Component, inject, signal } from '@angular/core';
import { ReportesGeneralesService } from '../../services/reportes-generales.service';
import { Catalogo } from '../../interfaces/catalogo.inteface';
import Swal from 'sweetalert2';

@Component({
  selector: 'main-reportes-generales-page',
  templateUrl: './reportes-generales-page.component.html',
  styleUrl: './reportes-generales-page.component.css'
})
export class ReportesGeneralesPageComponent {
  private reportesService = inject(ReportesGeneralesService);

  public reportesConsulta: Catalogo[] = [
    {
      id:'proyectosOpinar',
      nombre:'Proyectos a Opinar.'
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
      nombre:'Concentrado de Proyectos Participantes por Unidad Territorial.'
    },
    {
      id:'validacionResultados',
      nombre:'Validación de Resultados de la Consulta por Unidad Territorial.',
      tipo:1
    },
    {
      id:'validacionResultadosDetalle',
      nombre:'Validación de Resultados de la Consulta Detalle por Mesa.',
      tipo:1
    },
    {
      id:'MesasConComputo',
      nombre:'Mesas Receptoras de Opinión con Cómputo Capturado.'
    },
    {
      id:'MesasSinComputo',
      nombre:'Mesas Receptoras de Opinión sin Cómputo Capturado.'
    },
    {
      id:'resultadosOpiMesa',
      nombre:'Resultados de Opiniones por Mesa.'
    },
    {
      id:'proyectosPrimerLugar',
      nombre:'Proyectos por Unidad Territorial que Obtuvieron el Primer Lugar.'
    },
    {
      id:'proyectosSegundoLugar',
      nombre:'Proyectos por Unidad Territorial que Obtuvieron el Segundo Lugar.'
    },
    {
      id:'proyectosEmpatePrimerLugar',
      nombre:'Casos de empates de los proyectos que obtuvieron el primer lugar.'
    },
    {
      id:'proyectosEmpateSegundoLugar',
      nombre:'Casos de empates de los proyectos que obtuvieron el segundo lugar.'
    },
    {
      id:'proyectosUTSinOpiniones',
      nombre:'Concentrado de Unidades Territoriales que no recibieron opiniones.'
    },
    {
      id:'levantadaDistrito',
      nombre:'Actas Levantadas en Dirección Distrital (causales de recuento).'
    },
  ];

  public reportesEleccion: Catalogo[] = [
    {
      id:'computoTotalUT',
      nombre:'Cómputo total de las Candidaturas por Unidades Territoriales.'
    },
    {
      id:'resultadoComputoTotalMesa',
      nombre:'Resultados del Cómputo total por Mesa.'
    },
    {
      id:'resultadoComputoTotalUT',
      nombre:'Resultados del Cómputo total por Unidad Territorial.'
    },
    {
      id:'concentradoParticipantes',
      nombre:'Concentrado de Candidaturas participantes.'
    },
    {
      id:'candidaturasEmpate',
      nombre:'Candidaturas en las que se presenta empate.'
    },
    {
      id:'resultadosMesa',
      nombre:'Resultados de votos por Mesa.'
    },
    {
      id:'MesasComputadas',
      nombre:'Concentrado de Mesas computadas.'
    },
    {
      id:'MesasNoComputadas',
      nombre:'Concentrado de Mesas que no han sido computadas.'
    },
    {
      id:'UTConComputo',
      nombre:'Unidades Territoriales con Cómputo capturado.'
    },
    {
      id:'UTSinComputo',
      nombre:'Unidades Territoriales sin Cómputo capturado.'
    },
    {
      id:'levantadaDistrito',
      nombre:'Actas levantadas en Dirección Distrital (causales de recuento).'
    },
    {
      id:'actasAlerta',
      nombre:'Actas capturadas con alertas.'
    },
  ];

  public claveColonia = signal<string | undefined>(undefined);
  public anio = signal<number>(0);

  getAnio = (anio:number):void => {
    this.anio.set(+anio);
  }

  downloadReports = (params:string, post:boolean | undefined = undefined):void => {
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
      text:'Obteniendo datos para generar el reporte...',
      allowEscapeKey:false,
      allowOutsideClick:false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    this.reportesService.downloadReporte(this.anio(),params, this.claveColonia(), post)
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
  }
}
