import { Component, inject, input, OnInit, output, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { CatalogosService } from '../../../main/services/catalogos.service';
import { Catalogo } from '../../../main/interfaces/catalogo.inteface';
import { EleccionesService } from '../../../main/services/elecciones.service';

@Component({
  selector: 'shared-selector',
  templateUrl:'./selector.component.html',
  styles: `
    select {
      text-transform: none;
    }
  `
})
export class SelectorComponent implements OnInit {
  private fb = inject(FormBuilder);
  private catalogosService = inject(CatalogosService);

  //Declaración del formulario reactivo para el funcionamiento del selector del tipo/año de elección.
  public selectorForm:FormGroup = this.fb.group({
    id:['']
  });

  //Array signal para llenar el selector de año/tipo de elección del formulario.
  public listaEleccion = signal<Catalogo[]>([]);

  //Obtención del campo y su valor para posterior manipulación.
  private get inputId():FormControl {return this.selectorForm.get('id') as FormControl};
  private get id():number {return this.inputId.value};

  //Variables input para obtener valores procedentes del padre.
  public inputAnio = input<number | undefined>();
  public disabled = input<boolean | undefined>();
  public filtrar = input<boolean | undefined>()

  //Variables output para proporcionar valores de salida al padre.
  public anio = output<number>();
  public verify = output<boolean>();

  ngOnInit(): void {
    if(this.catalogosService.listaEleccion() !== undefined) {
      this.listaEleccion.set(this.catalogosService.listaEleccion()!);
      if(this.filtrar()) {
        this.listaEleccion.set(this.listaEleccion().filter(eleccion => eleccion.id != '1'));
      }
      if(this.listaEleccion().length > 1) {
        if(this.inputAnio() !== undefined) {
          this.inputId.setValue(this.inputAnio());
        } else {
          this.inputId.setValue('2');
        }
      } else {
        this.inputId.setValue('1');
      }
      this.anio.emit(this.id);
    } else {
      this.inputId.disable();
      this.catalogosService.getCatalogo('tipoEleccion')
      .subscribe(res => {
        if(res.success) {
          this.inputId.enable();
        }
        this.catalogosService.listaEleccion.set(res.datos as Catalogo[]);
        this.listaEleccion.set(this.catalogosService.listaEleccion()!);
        if(this.filtrar()) {
        this.listaEleccion.set(this.listaEleccion().filter(eleccion => eleccion.id != '1'));
        }
        if(this.listaEleccion().length > 1) {
          if(this.inputAnio() !== undefined) {
            this.inputId.setValue(this.inputAnio());
          } else {
            this.inputId.setValue('2');
          }
        } else {
          this.inputId.setValue('1');
        }
        this.anio.emit(this.id);
      })
    }
    if(this.disabled()) {
      this.inputId.disable();
      this.anio.emit(this.id);
    }
  }

  getId = ():void => {
    this.anio.emit(this.id);
  }

  sendVerify = ():void => {
    this.verify.emit(true);
  }
}
