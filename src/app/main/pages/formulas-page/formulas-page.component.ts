import { Component, inject, OnInit, signal } from '@angular/core';
import { VerificaService } from '../../../auth/services/verifica.service';
import { CatalogosService } from '../../services/catalogos.service';
import Swal from 'sweetalert2';
import { forkJoin } from 'rxjs';
import { Catalogo } from '../../interfaces/catalogo.inteface';
import { Formulas } from '../../interfaces/formulas.interface';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { DtAttributesService } from '../../../shared/services/dt-attributes.service';
import { Config } from 'datatables.net';

@Component({
  selector: 'main-formulas-page',
  templateUrl: './formulas-page.component.html',
  styles: `
    select {
      text-transform:none;
    }

    .fixed {
      position:sticky !important;
      top: 100px !important;
      z-index:100 !important;
      background-color: #FFFFFF;
    }

    thead tr th {
      text-align: center !important;
      position: sticky !important;
      top:193px !important;
      background-color: #32215C;
      color: #FFFFFF;
      z-index: 50 !important;
    }

    table {
      border: solid 1px #522A78 !important;
    }
  `
})
export class FormulasPageComponent implements OnInit {
  private fb = inject(FormBuilder);
  private verifyService = inject(VerificaService);
  private catalogosService = inject(CatalogosService);
  private dtAttributesService = inject(DtAttributesService);

  // Declaración del formulario reactivo de operación de la página principal.
  public formulasForm:FormGroup = this.fb.group({
    clave_colonia:['']
  });

  get claveColonia():FormControl {return this.formulasForm.get('clave_colonia') as FormControl};
  get clave():string {return this.claveColonia.value};

  //Declaración de variables.
  public listaColonias = signal<Catalogo[] | undefined>(undefined);
  public listaFormulas = signal<Formulas[] | undefined>(undefined);
  public delegacion = signal<string>('');
  public dtOptions = signal<Config>({});

  private message = (text:string):void => {
  Swal.fire({
    title:'Espere un momento',
    html:text,
    allowEscapeKey:false,
    allowOutsideClick:false,
    didOpen: () => {
      Swal.showLoading();
    }
  });
}

  ngOnInit(): void {
    this.getColonias();
    this.dtOptions.set(this.dtAttributesService.dtOptions);
  }

  getColonias = ():void => {
    this.message('Cargando lista de Unidades Territoriales disponibles...');
    forkJoin({
      verify: this.verifyService.checkAuthentication(),
      res: this.catalogosService.getCatalogo('colonias','',1)
    }).subscribe(({verify, res}) => {
      if(!verify) return;
      Swal.close();
      this.listaColonias.set(res.datos as Catalogo[]);
    })
  }

  getFormulas = ():void => {
    this.listaFormulas.set(undefined);
    this.delegacion.set('');
    if(this.clave !== '') {
      this.message('Cargando lista de Candidaturas...');
      forkJoin({
        verify: this.verifyService.checkAuthentication(),
        delegacion: this.catalogosService.getCatalogo('delegacion',this.clave,1),
        res: this.catalogosService.getCatalogo('formulas',this.clave)
      }).subscribe(({verify, delegacion, res}) => {
        if(!verify) return;
        this.listaFormulas.set(res.datos as Formulas[]);
        this.delegacion.set(delegacion.delegacion);
        Swal.close();
      })
    }
  }
}
