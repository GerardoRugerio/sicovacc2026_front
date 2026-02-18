import { Component, inject, OnInit, signal } from '@angular/core';
import { DownloadService } from '../../services/download.service';
import Swal from 'sweetalert2';
import { Catalogo } from '../../../main/interfaces/catalogo.inteface';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styles: `
  select {
    text-transform: none;
  }

  .fixed {
    position:sticky;
    top:100px;
    z-index: 100;
    background-color: #FFF;
  }
  `
})
export class ReportesComponent implements OnInit {
  private fb = inject(FormBuilder);
  private downloadService = inject(DownloadService);

  public form = this.fb.group({
    distrito:['0']
  });

  public reportesConsulta = [
    {
      id:'baseDatos',
      nombre:'Base de Datos.',
      distrito: true
    },
    {
      id:'proyectosParticipantes',
      nombre:'Concentrado de Proyectos Participantes por Distrito y Unidad Territorial.',
      distrito: true
    },
    {
      id:'consultaCiudadanaDetalle',
      nombre:'Validación de Resultados de la Consulta Ciudadana Detalle por Mesa.',
      distrito: true
    },
    {
      id:'opinionesMesa',
      nombre:'Resultados de Opiniones por Mesa.',
      distrito: true
    },
    {
      id:'consultaUnidadTerritorial',
      nombre:'Validación de Resultados de la Consulta por Unidad Territorial.',
      distrito: true
    },
    {
      id:'opinionesUT',
      nombre:'Concentrado de Opiniones por Unidad Territorial.',
      distrito: true
    },
    {
      id:'proyectosPrimerLugar',
      nombre:'Proyectos por Unidad Territorial que Obtuvieron el Primer Lugar en la Consulta de Presupuesto Participativo.',
      distrito: true
    },
    {
      id:'proyectosEmpatePrimerLugar',
      nombre:'Casos de Empates de los Proyectos que Obtuvieron el Primer Lugar.',
      distrito: true
    },
    {
      id:'proyectosEmpateSedundoLugar',
      nombre:'Casos de Empates de los Proyectos que Obtuvieron el Segundo Lugar.',
      distrito: true
    },
    {
      id:'proyectosSinOpiniones',
      nombre:'Concentrado de Unidades Territoriales que no recibieron opiniones.',
      distrito: true
    },
    {
      id:'asistenciaUT',
      nombre:'Reporte de Asistencia por Unidad Territorial.',
      distrito: true
    },
    {
      id:'MesasConComputo',
      nombre:'Mesas Receptoras de Opinión con Cómputo Capturado.',
      distrito: true
    },
    {
      id:'MesasSinComputo',
      nombre:'Mesas Receptoras de Opinión sin Cómputo Capturado.',
      distrito: true
    },
    {
      id:'UTConComputoGA',
      nombre:'Concentrado de Unidades Territoriales por Distrito Electoral con Cómputo Capturado (Grado de Avance).',
      distrito: false
    },
    {
      id:'opinionesDistrito',
      nombre:'Opiniones por Distrito.',
      distrito: false
    },
    {
      id:'opinionesDemarcacion',
      nombre:'Opiniones por Demarcación.',
      distrito: false
    },
    {
      id:'levantadaDistrito',
      nombre:'Actas levantadas en Dirección Distrital (Causales de recuento).',
      distrito: true
    },
    {
      id:'participacion',
      nombre:'Porcentaje de Participación.',
      distrito: false
    }
  ];

  public reportesEleccion = [
    {
      id:'computoTotalUT',
      nombre:'Cómputo Total de las Candidaturas por Unidad Territorial.',
      distrito: true
    },
    {
      id:'resultadoComputoTotalMesa',
      nombre:'Resultados del Cómputo Total por Mesa.',
      distrito: true
    },
    {
      id:'resultadoComputoTotalUT',
      nombre:'Resultados del Cómputo Total por Unidad Territorial.',
      distrito: true
    },
    {
      id:'concentradoParticipantes',
      nombre:'Concentrado de Candidaturas Participantes.',
      distrito: true
    },
    {
      id:'candidaturasEmpate',
      nombre:'Candidaturas en las que se presenta empate.',
      distrito: true
    },
    {
      id:'resultadosMesa',
      nombre:'Resultados de Votos por Mesa.',
      distrito: true
    },
    {
      id:'MesasComputadas',
      nombre:'Concentrado de Mesas Capturadas.',
      distrito: true
    },
    {
      id:'MesasNoComputadas',
      nombre:'Concentrado de Mesas que no han sido Computadas.',
      distrito: true
    },
    {
      id:'UTConComputo',
      nombre:'Unidades Territoriales Con Cómputo Capturado.',
      distrito: true
    },
    {
      id:'UTSinComputo',
      nombre:'Unidades Territoriales Sin Cómputo Capturado.',
      distrito: true
    },
    {
      id:'UTConComputoGA',
      nombre:'Concentrado de Unidades Territoriales por Distrito Electoral con Cómputo Capturado (Grado de Avance).',
      distrito: false
    },
    {
      id:'levantadaDistrito',
      nombre:'Actas Levantadas en Dirección Distrital',
      distrito: true
    },
    {
      id:'votacionDistrito',
      nombre:'Votación Total por Distrito.',
      distrito: false
    },
    {
      id:'votacionDemarcacion',
      nombre:'Votación Total por Demarcación.',
      distrito: false
    },
    {
      id:'participacion',
      nombre:'Porcentaje Participación por Distrito.',
      distrito: false
    },
    {
      id:'actasAlerta',
      nombre:'Actas Capturadas con Alertas.',
      distrito: true
    },
  ]

  public distritos = signal<Catalogo[]>([]);
  public anio = signal<number>(0);

  get distrito():string {return this.form.get('distrito')?.value!};

  ngOnInit(): void {
    for(let i = 1; i <= 33; i++) {
      this.distritos().push({id: i.toString(), nombre: i.toString()});
    }
  }

  getAnio = (anio:number):void => {
    this.anio.set(anio);
  }

  download = (path:string, distrito:boolean):void => {
    const modo = (path.match('inicioCierreValidacion') || path.match('incidentes')) ? '' : (this.anio() > 1 ? 'consulta/' : 'eleccion/');
    const year = path.match('inicioCierreValidacion') ? '' : `?anio=${this.anio()}`;
    const url = distrito ? `${modo}${path}/${this.distrito}${year}` : `${modo}${path}${year}`;

    if(this.anio() == 0 && !path.match('inicioCierreValidacion')) {
      Swal.fire({
        icon:'error',
        title:'¡No permitido!',
        text:'No se permite la descarga de reportes sin un año/tipo de consulta seleccionado.',
        confirmButtonText:'Entendido'
      });
      return;
    }

    Swal.fire({
      title:'Espere un momento',
      text:'Obteniendo datos del reporte...',
      didOpen:() => {
        Swal.showLoading();
      }
    });

    this.downloadService.downloadReportes(url)
    .subscribe(res => {
      Swal.close();
      if(res.success) {
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
          icon:'error',
          title:'¡Error en descarga!',
          text: res.msg,
          confirmButtonText:'Entendido',
          timer:2300
        })
      }
    })
  }
}

