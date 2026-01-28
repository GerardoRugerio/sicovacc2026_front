import { Component, OnInit, inject, input, output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Proyects } from '../../../shared/interfaces/content.interface';

declare let $:any;

@Component({
  selector: 'main-descripcion',
  templateUrl: './descripcion.component.html',
  styleUrl: './descripcion.component.css'
})

export class DescripcionComponent implements OnInit {
  private fb = inject(FormBuilder);

  //Declaración del formulario reactivo a llenar con los datos obtenidos del padre.
  public descripcionForm:FormGroup = this.fb.group({
    num_proyecto:[''],
    fecha:[''],
    costo_aproximado:[''],
    folio_proy_web:[''],
    rubro_general:[''],
    nom_proyecto:[''],
    ciudadano_presenta:[''],
    poblacion_benef:[''],
    ubicacion_exacta:[''],
    descripcion:[''],
  });

  //Estos inputs y outpus funcionan directamente con la lógica principal del formulario y con la respuesta de datos que se mandan de vuelta al padre
  //de este componente.
  public proyecto = input<Proyects>();
  public reset = output<boolean>();

  ngOnInit(): void {
    $('#datosProyecto').modal('show');
    this.descripcionForm.patchValue(this.proyecto() as Proyects);
    this.descripcionForm.disable();
  }

  closeModal = ():void => {
    $('#datosProyecto').modal('hide');
    setTimeout(() => {
      this.reset.emit(false);
    },400)
  }
}
