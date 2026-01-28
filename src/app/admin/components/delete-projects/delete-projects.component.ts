// import { Component, inject, OnInit } from '@angular/core';
// import { AdminService } from '../../services/admin.service';
// import { Catalogo } from '../../../main/interfaces/catalogo.inteface';
// import { CatalogosService } from '../../../main/services/catalogos.service';
// import { FormBuilder, FormControl } from '@angular/forms';
// import { Proyects } from '../../../shared/interfaces/content.interface';
// import Swal from 'sweetalert2';
// @Component({
//   selector: 'admin-delete-projects',
//   templateUrl: './delete-projects.component.html',
//   styles: `
//     thead tr:first-child th {
//       position: sticky;
//       top:-17px;
//       background-color: #32215C !important;
//       color: white !important;
//       font-weight: bold !important;
//       text-align: center !important;
//       border: solid 1px #32215c88 !important;
//     }
//     table{
//       border: solid 1px #522A78 !important;
//     }
//     table td {
//       border:solid 1px #32215c88 !important;
//     }
//   `
// })
// export class DeleteProjectsComponent implements OnInit {
//   private fb = inject(FormBuilder);
//   private catalogosService = inject(CatalogosService);
//   private adminService = inject(AdminService);
//   // private dtAttributesService = inject(DtAttributesService);
//   // private authService = inject(AuthService);
//   // private verificaService = inject(VerificaService);

//   public myForm = this.fb.group({
//     id_distrito:[''],
//     clave_colonia:['']
//   })

//   public distritos:Catalogo[] = [];
//   public colonias:Catalogo[] = [];
//   public lista_proyectos:Proyects[] | undefined;
//   public anio:number = 0;

//   get input_distrito():FormControl {
//     return this.myForm.get('id_distrito') as FormControl;
//   }

//   get input_colonia():FormControl {
//     return this.myForm.get('clave_colonia') as FormControl;
//   }

//   get id_distrito():string {
//     return this.input_distrito.value;
//   }

//   get clave_colonia():string {
//     return this.input_colonia.value;
//   }

//   ngOnInit(): void {
//     for(let i = 1; i <= 33; i++) {
//       this.distritos.push({id: i.toString(), nombre: i.toString()})
//     }

//     this.input_colonia.disable();
//   }

//   getAnio = (anio:number):void => {
//     this.anio = anio;
//     this.input_distrito.setValue('');
//     if(this.anio == 0) {
//       this.input_distrito.disable();
//       this.input_distrito.setValue('');
//     } else {
//       this.input_distrito.enable();
//     }
//     this.getListaColonias();
//   }

//   getListaColonias = ():void => {
//     this.input_colonia.setValue('');
//     this.lista_proyectos = undefined;
//     if(this.id_distrito !== '') {
//       Swal.fire({
//         title:'Espere un momento',
//         text:'Cargando lista de Unidades Territoriales...',
//         allowEscapeKey:false,
//         allowOutsideClick:false,
//         showConfirmButton:false,
//         didOpen:() => {
//           Swal.showLoading();
//         }
//       });

//       this.catalogosService.getTerritorialCatalogos(this.anio, +this.id_distrito)
//       .subscribe(res => {
//         Swal.close();
//         this.colonias = res.datos as Catalogo[];
//       })
//       this.input_colonia.enable();
//     } else {
//       this.input_colonia.disable();
//     }
//   }

//   getListaProyectos = ():void => {
//     Swal.fire({
//       title:'Espere un momento',
//       text:'Cargando lista de proyectos...',
//       allowEscapeKey:false,
//       allowOutsideClick:false,
//       showConfirmButton:false,
//       didOpen:() => {
//         Swal.showLoading();
//       }
//     });

//     this.lista_proyectos = undefined;
//     this.adminService.getListaProyectos(this.anio, +this.id_distrito, this.clave_colonia)
//     .subscribe(res => {
//       Swal.close();
//       this.lista_proyectos = res.datos as Proyects[];
//     })
//   }

//   getDeleteConfirm = (confirm:boolean):void => {
//     if(confirm) {
//       this.getListaProyectos();
//     }
//   }
// }

import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { CatalogosService } from '../../../main/services/catalogos.service';
import { AdminService } from '../../services/admin.service';
import { Catalogo } from '../../../main/interfaces/catalogo.inteface';
import { Proyects } from '../../../shared/interfaces/content.interface';
import Swal from 'sweetalert2';
import { forkJoin } from 'rxjs';
import { VerificaService } from '../../../auth/services/verifica.service';
import { DtAttributesService } from '../../../shared/services/dt-attributes.service';
import { Config } from 'datatables.net';

@Component({
  selector: 'admin-delete-projects',
  templateUrl: './delete-projects.component.html',
  styles: `
    thead tr:first-child th {
      position: sticky;
      top:-17px;
      background-color: #32215C !important;
      color: white !important;
      font-weight: bold !important;
      text-align: center !important;
      border: solid 1px #32215c88 !important;
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
  `
})
export class DeleteProjectsComponent implements OnInit {
  private fb = inject(FormBuilder);
  private catalogosService = inject(CatalogosService);
  private adminService = inject(AdminService);
  private verifyService = inject(VerificaService);
  private dtService = inject(DtAttributesService);

  //Declaración del formulario para operación de la página principal.
  public adminForm:FormGroup = this.fb.group({
    id_distrito:[''],
    clave_colonia:['']
  });

  //Declaración de variables(señales) de operación.
  public listaDistritos = signal<Catalogo[]>([]);
  public listaColonias = signal<Catalogo[]>([]);
  public listaProyectos = signal<Proyects[]>([]);
  public anio = signal<number>(0);
  public dtOptions = signal<Config>({});

  //Obtención de los campos del formulario.
  get idDistrito():FormControl {return this.adminForm.get('id_distrito') as FormControl};
  get claveColonia():FormControl {return this.adminForm.get('clave_colonia') as FormControl};

  //Obtención de los valores de los campos del formulario.
  get distrito():number {return this.idDistrito.value};
  get clave():string {return this.claveColonia.value};

  ngOnInit(): void {
    this.adminForm.disable();
    this.dtOptions.set(this.dtService.dtOptions);
    for(let i = 1; i <= 33; i++) {
      this.listaDistritos().push({id: i.toString(),nombre: i.toString()});
    }
  }

  getAnio = (anio:number):void => {
    this.anio.set(anio);
    this.idDistrito.setValue('');
    this.claveColonia.setValue('');
    if(this.anio() > 0) {
      this.idDistrito.enable()
    } else {
      this.idDistrito.disable();
      this.claveColonia.disable();
    }
  }

  getColonias = ():void => {
    this.claveColonia.disable();
    this.claveColonia.setValue('');
    this.listaProyectos.set([]);
    if(this.distrito > 0) {
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
        res : this.catalogosService.getCatalogo('coloniasConActas','',this.anio(), this.distrito)
      }).subscribe(({verify, res}) => {
        if(!verify) return ;
        Swal.close();
        if(!res.success) {
          Swal.fire({
            icon:'warning',
            title:'¡Atención!',
            text:res.msg
          })
          return;
        }
        this.listaColonias.set(res.datos as Catalogo[]);
        this.claveColonia.enable();
      })
    }
  }

  getProyectos = ():void => {
    Swal.fire({
      title:'Espere un momento',
      text:'Cargando lista de proyectos participantes en esta Unidad Territorial...',
      allowEscapeKey:false,
      allowOutsideClick:false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    forkJoin({
      verify: this.verifyService.checkAuthentication(),
      res: this.adminService.getListaProyectos(this.anio(), this.distrito, this.clave)
    }).subscribe(({verify, res}) => {
      if(!verify) return;
      Swal.close();
    })
  }
}
