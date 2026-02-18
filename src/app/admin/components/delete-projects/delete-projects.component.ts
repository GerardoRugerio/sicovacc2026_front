import { Component, inject, OnInit, signal } from '@angular/core';
import { DtAttributesService } from '../../../shared/services/dt-attributes.service';
import { Config } from 'datatables.net';
import { Catalogo } from '../../../main/interfaces/catalogo.inteface';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';
import { firstValueFrom, forkJoin } from 'rxjs';
import { VerificaService } from '../../../auth/services/verifica.service';
import { CatalogosService } from '../../../main/services/catalogos.service';
import { Proyects } from '../../../shared/interfaces/content.interface';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'admin-delete-projects',
  templateUrl: './delete-projects.component.html',
  styles: `
    thead tr:first-child th {
      position: sticky;
      top:225px;
      background-color: #32215C !important;
      color: white !important;
      font-weight: bold !important;
      text-align: center !important;
      // border: solid 1px #322155 !important;
    }
    table{
      border: solid 1px #522A78 !important;
    }
    table td {
      border:solid 1px #32215c88 !important;
    }

    select {
      text-transform: none;
    }

    .fixed {
      position: sticky;
      top:100px !important;
      background-color:#FFF;
      z-index:10 !important;
    }
  `
})
export class DeleteProjectsComponent implements OnInit {
  private fb = inject(FormBuilder);
  private dtAttributesService = inject(DtAttributesService);
  private verifyService = inject(VerificaService);
  private catalogosService = inject(CatalogosService);
  private adminService = inject(AdminService);

  public adminForm:FormGroup = this.fb.group({
    id_distrito:[''],
    clave_colonia:['']
  });

  public dtOptions = signal<Config>({});
  public distritos = signal<Catalogo[]>([]);
  public anio = signal<number>(0);
  public listaColonias = signal<Catalogo[]>([]);
  public lista = signal<Proyects[]>([]);

  //Getters de datos de los campos del formulario principal.
  get distrito():FormControl {return this.adminForm.get('id_distrito') as FormControl};
  get colonia():FormControl {return this.adminForm.get('clave_colonia') as FormControl};

  //Getters de los valores de los campos del formulario.
  get distritoValue():number {return this.distrito.value};
  get coloniaValue():string {return this.colonia.value};

  ngOnInit(): void {
    this.dtOptions.set(this.dtAttributesService.dtOptions);
    for(let i = 1; i <= 33; i++) {
      this.distritos().push({id: String(i), nombre: String(i)});
    }
    this.colonia.disable();
  }

  private message = (text:string) => Swal.fire({
    title:'Espere un momento',
    text,
    allowEscapeKey:false,
    allowOutsideClick:false,
    didOpen: () => {
      Swal.showLoading();
    }
  });

  getAnio = (anio:number):void => {
    this.anio.set(+anio);
    this.distrito.setValue('');
    this.colonia.setValue('');
    this.listaColonias.set([]);
    this.colonia.disable();
    this.lista.set([]);
    if(this.anio() == 0) {
      this.distrito.disable();
      this.colonia.disable();
    } else {
      this.distrito.enable();
    }
  }

  getColonias = ():void => {
    this.colonia.setValue('');
    this.lista.set([]);
    if(this.distritoValue == 0) {
      this.colonia.disable();
      return;
    } else {
      this.colonia.enable();
    }

    this.message('Cargando lista de Unidades Territoriales para este distrito...');

    forkJoin({
      verify: this.verifyService.checkAuthentication(),
      res: this.catalogosService.getCatalogo('colonias',undefined, this.anio(), this.distritoValue)
    }).subscribe(({verify, res}) => {
      if(!verify) return;
      Swal.close();
      this.listaColonias.set(res.datos as Catalogo[]);
    })
  }

  getLista = ():void => {
    this.lista.set([]);
    this.message(`Cargando lista de ${this.anio() > 1 ? 'proyectos' : 'candidatos'}...`);
    forkJoin({
      verify: this.verifyService.checkAuthentication(),
      res: this.adminService.getListaProyectos(this.anio() > 1 ? 'eliminarProyectos' : 'eliminarParticipantes', this.anio(), this.distritoValue, this.coloniaValue)
    }).subscribe(({verify, res}) => {
      Swal.close();
      if(!verify) return;
      if((res.datos as Proyects[]) == undefined) {
        Swal.fire({
          icon:'info',
          title:'¡Atención!',
          text:`No se encontraron ${this.anio() > 1 ? 'proyectos' : 'candidatos'}.`,
          confirmButtonText:'Entendido',
          allowEscapeKey:false,
          allowOutsideClick:false
        });
        return;
      }
      this.lista.set(res.datos as Proyects[]);
    })
  }

  deleteById = (id:number, nombre:string):void => {
    Swal.fire({
      icon:'warning',
      title:'¡Atención!',
      html:`Se requiere la confirmación del texto requerido en pantalla para realizar la eliminación de${this.anio() > 1 ? 'l proyecto' : ' la persona candidata'}
      <b>(${nombre.toUpperCase().trim()})</b>.`,
      input:'text',
      inputPlaceholder:'Eliminar',
      customClass:{input:'input-sweet'},
      showCancelButton:true,
      cancelButtonText:'Cancelar',
      confirmButtonText:'Confirmar',
      allowEscapeKey:false,
      allowOutsideClick: false,
      showLoaderOnConfirm:true,
      preConfirm: async (value) => {
        if(!value) {
          Swal.showValidationMessage('Es necesario proporcionar la frase requerida para continuar.');
          return false;
        }

        if(value.trim() !== 'Eliminar') {
          Swal.showValidationMessage(`La frase "${value}" no coincide con la requerida.`);
          return false;
        }

        const verify = await firstValueFrom(this.verifyService.checkAuthentication());
        if(!verify) return;
        const res = await firstValueFrom(this.adminService.deleteProyectos(
          this.anio() > 1 ? 'eliminarProyectos' : 'eliminarParticipantes',
          this.anio(),
          id
        ));
        if(!res.success) {
          Swal.showValidationMessage(res.msg || 'Ocurrió un error desconocido.');
          return false;
        }
        return res;
      }
    }).then((result) => {
      if(result.isConfirmed && result.value && result.value.success) {
        Swal.fire({
          icon:'success',
          title:'¡Correcto!',
          text:result.value.msg,
          showConfirmButton:false,
          timer:2000,
          allowEscapeKey:false,
          allowOutsideClick:false
        }).then(() => {
          this.getLista();
        })
      }
    })
  }
}
