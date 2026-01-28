import { Component, OnInit, inject, input, output, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Catalogo } from '../../interfaces/catalogo.inteface';
import { EleccionesService } from '../../services/elecciones.service';
import { CatalogosService } from '../../services/catalogos.service';

@Component({
  selector: 'main-buscadores',
  templateUrl: './buscadores.component.html',
  styleUrl: './buscadores.component.css'
})
export class BuscadoresComponent implements OnInit {
  private fb = inject(FormBuilder);
  private eleccionesService = inject(EleccionesService);
  private catalogosService = inject(CatalogosService);

  public form:FormGroup = this.fb.group({
    id:['']
  })

  public lista_anios = signal<Catalogo[]>([])

  get input_id():FormControl {return this.form.get('id') as FormControl;}

  get id():string {return this.input_id.value;}

  public input_anio = input<number | undefined>(undefined);
  public disabled = input<boolean | undefined>(undefined);
  public anio = output<number>();

  getId = ():void => {
    this.anio.emit(+this.id);
  }

  ngOnInit(): void {
    if(this.catalogosService.listaEleccion !== undefined) {
      this.lista_anios.set(this.catalogosService.listaEleccion()!);
      if(this.lista_anios().length > 1) {
        if(this.input_anio() !== undefined) {
          this.input_id.setValue(this.input_anio());
        } else {
          this.input_id.setValue('2');
        }
      } else {
        this.input_id.setValue('1');
      }
      this.anio.emit(+this.id);
    } else {
      this.input_id.disable();
      this.catalogosService.getCatalogo('tipoEleccion','')
      .subscribe(res => {
        if(res.success) {
          this.input_id.enable();
        }
        this.catalogosService.listaEleccion.set(res.datos as Catalogo[]);
        this.lista_anios.set(this.catalogosService.listaEleccion()!);
        if(this.lista_anios().length > 1) {
          if(this.input_anio() !== undefined) {
            this.input_id.setValue(this.input_anio());
          } else {
            this.input_id.setValue('2');
          }
        } else {
          this.input_id.setValue('1');
        }
        this.anio.emit(+this.id);
      })
    }
  }
}
