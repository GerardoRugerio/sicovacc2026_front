import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { DtAttributesService } from '../../../shared/services/dt-attributes.service';
import { VerificaService } from '../../../auth/services/verifica.service';
import { CatalogosService } from '../../services/catalogos.service';

import { Catalogo } from '../../interfaces/catalogo.inteface';
import { Proyects } from '../../../shared/interfaces/content.interface';
import { Config } from 'datatables.net';
import { forkJoin } from 'rxjs';

import Swal from 'sweetalert2';
import { Location } from '@angular/common';

@Component({
  selector: 'main-consult-page',
  templateUrl: './consult-page.component.html',
  styleUrl: './consult-page.component.css'
})
export class ConsultPageComponent implements OnInit {
  private fb = inject(FormBuilder);
  private verifyService = inject(VerificaService);
  private catalogosService = inject(CatalogosService);
  private dtService = inject(DtAttributesService);
  private location = inject(Location);

  //Declaración del formulario reactivo de la página principal.
  public proyectosForm:FormGroup = this.fb.group({
    clave_colonia:['']
  });

  //Obtención de los campos del formulario y sus valores.
  private get claveColonia():FormControl {return this.proyectosForm.get('clave_colonia') as FormControl};
  private get clave():string {return this.claveColonia.value};

  //Declaración de los valores de configuración iniciales del DataTable.
  public dtOptions:Config = {};

  //Declaración de las variables(señales) para el funcionamiento de la página principal.
  public anio = signal<number>(0);
  public listaColonias = signal<Catalogo[]>([]);
  public listaProyectos = signal<Proyects[] | undefined>(undefined);
  public showModal = signal<boolean>(false);
  public delegacion = signal<string>('');
  public proyecto = signal<Proyects | undefined>(undefined);
  public ubicacion = signal<string>('');
  public num_proyecto = signal<number>(0);

  ngOnInit(): void {
    if(this.location.path().includes('consulta_proyectos')) {
      this.ubicacion.set('proyectos');
    } else {
      this.ubicacion.set('fórmulas')
    }
    this.dtOptions = this.dtService.dtOptions;
  }

  //Funciones de retorno de datos provenientes de los componentes hijos "<shared-selector>" y "<main-descripcion>".
  getAnio = (anio:number):void => {
    this.listaProyectos.set(undefined);
    this.anio.set(anio);
    if(this.anio() > 0) {
      this.getColonias();
      this.claveColonia.enable();
    } else {
      this.claveColonia.disable();
    }
  }

  getReset = (reset:boolean):void => {
    this.showModal.set(reset);
  }

  getColonias = ():void => {
    this.claveColonia.setValue('');
    this.listaColonias.set([]);
    this.listaProyectos.set(undefined);
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
      res: this.catalogosService.getCatalogo('colonias',undefined, this.anio())
    }).subscribe(({verify, res}) => {
      if(!verify) return;
      Swal.close();
      if(res.datos !== undefined && res.success) {
        this.listaColonias.set(res.datos as Catalogo[]);
        this.claveColonia.enable();
      } else {
        this.claveColonia.disable();
        Swal.fire({
          icon:'warning',
          title:'¡Atención!',
          text:'No se han encontrado Unidades Territoriales para este año/tipo de consulta',
          allowEscapeKey:false,
          allowOutsideClick:false,
          confirmButtonText:'Entendido'
        });
      }
    })
  }


  getProyectos = ():void => {
    this.listaProyectos.set(undefined);
    this.delegacion.set('');
    this.num_proyecto.set(0);
    Swal.fire({
      title:'Espere un momento',
      text:'Cargando lista de proyectos registrados en esta Unidad Territorial...',
      allowEscapeKey:false,
      allowOutsideClick:false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    forkJoin({
      verify: this.verifyService.checkAuthentication(),
      delegacion: this.catalogosService.getCatalogo('delegacion', this.clave),
      res: this.catalogosService.getCatalogo('proyectos',this.clave,this.anio())
    }).subscribe(({verify, delegacion, res}) => {
      if(!verify) return;
      this.listaProyectos.set(res.datos as Proyects[]);
      this.delegacion.set(delegacion.delegacion);
      Swal.close();
    })
  }

  //Función para obtener los datos de un solo proyecto por medio del número de proyecto.
  getProyecto = (num_proyecto:number):Proyects => this.listaProyectos()?.find(proyecto => proyecto.num_proyecto == num_proyecto)!;

  //Apertura del modal con los datos obtenidos del proyecto seleccionado.
  openModal = (num_proyecto:number):void => {
    this.num_proyecto.set(num_proyecto); //Variable para designar el proyecto seleccionado y resaltarlo en la tabla de la página principal.
    this.showModal.set(true); //Variable(señal) para apertura del modal.
    this.proyecto.set(this.getProyecto(num_proyecto)); //Búsqueda del proyecto seleccionado en el array principal.
  }
}
