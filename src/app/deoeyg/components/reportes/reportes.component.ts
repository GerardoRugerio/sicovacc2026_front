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

  public reportes = [
    {
      id:'inicioCierreValidacion',
      nombre:'Reporte de asistencia de Inicio y Cierre de la Validación.',
      distrito: false
    },
    {
      id:'baseDatos',
      nombre:'F1. Base de Datos.',
      distrito: true
    },
    {
      id:'proyectosParticipantes',
      nombre:'F2. Concentrado de Proyectos Participantes por Distrito y Unidad Territorial.',
      distrito: true
    },
    {
      id:'incidentes',
      nombre:'F3. Incidentes presentados durante la validación de la consulta de presupuesto participativo.',
      distrito: true
    },
    {
      id:'consultaCiudadanaDetalle',
      nombre:'F4. Validación de Resultados de la Consulta Ciudadana Detalle por Mesa.',
      distrito: true
    },
    {
      id:'opinionesMesa',
      nombre:'F5. Resultados de Opiniones por Mesa.',
      distrito: true
    },
    {
      id:'consultaUnidadTerritorial',
      nombre:'F6. Validación de Resultados de la Consulta por Unidad Territorial.',
      distrito: true
    },
    {
      id:'opinionesUT',
      nombre:'F7. Concentrado de Opiniones por Unidad Territorial.',
      distrito: true
    },
    {
      id:'proyectosPrimerLugar',
      nombre:'F8. Proyectos por Unidad Territorial que Obtuvieron el Primer Lugar en la Consulta de Presupuesto Participativo.',
      distrito: true
    },
    {
      id:'proyectosEmpatePrimerLugar',
      nombre:'F9. Casos de Empates de los Proyectos que Obtuvieron el Primer Lugar.',
      distrito: true
    },
    {
      id:'proyectosSinOpiniones',
      nombre:'F10. Concentrado de Unidades Territoriales que no recibieron opiniones.',
      distrito: true
    },
    {
      id:'asistenciaUT',
      nombre:'F11. Reporte de Asistencia por Unidad Territorial.',
      distrito: true
    },
    {
      id:'MesasConComputo',
      nombre:'F12. Mesas Receptoras de Opinión con Cómputo Capturado.',
      distrito: true
    },
    {
      id:'MesasSinComputo',
      nombre:'F13. Mesas Receptoras de Opinión sin Cómputo Capturado.',
      distrito: true
    },
    {
      id:'UTConComputoGA',
      nombre:'F14. Concentrado de Unidades Territoriales por Distrito Electoral con Cómputo Capturado (Grado de Avance).',
      distrito: false
    },
    {
      id:'opinionesDistrito',
      nombre:'F15. Opiniones por Distrito.',
      distrito: false
    },
    {
      id:'opinionesDemarcacion',
      nombre:'F16. Opiniones por Demarcación.',
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
    let url = '';
    if(distrito) {
      url = `${path}/${this.distrito}`;
    } else {
      url = path;
    }

    if(this.anio() == 0 && path !== 'inicioCierreValidacion') {
      Swal.fire({
        icon:'error',
        title:'¡No permitido!',
        text:'No se permite la descarga de reportes sin un año/tipo de consulta seleccionado.',
        confirmButtonText:'Entendido'
      });
      return;
    } else {
      Swal.fire({
        title:'Espere un momento',
        text:'Obteniendo datos del reporte...',
        didOpen:() => {
          Swal.showLoading();
        }
      });

      this.downloadService.downloadReportes(this.anio(), url)
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

}

