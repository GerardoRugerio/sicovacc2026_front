import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { Proyects } from '../../../shared/interfaces/content.interface';
import { DtAttributesService } from '../../../shared/services/dt-attributes.service';
import { Config } from 'datatables.net';
import Swal from 'sweetalert2';
import { AdminService } from '../../services/admin.service';
import { LoginPageComponent } from '../../../auth/pages/login-page/login-page.component';

declare var $:any;

@Component({
  selector: 'admin-projects-table',
  templateUrl: './projects-table.component.html',
  styles: ``
})
export class ProjectsTableComponent implements OnInit {
  private dtAttrib = inject(DtAttributesService);
  private adminService = inject(AdminService);

  public dtOptions:Config = {};
  private id_proyecto:number = 0;

  @Input()
  public lista_proyectos:Proyects[] | undefined;

  @Input()
  public anio: number = 0;

  @Output()
  public confirm = new EventEmitter<boolean>();

  ngOnInit(): void {
    this.dtOptions = this.dtAttrib.dtOptions;
  }

  openModal = (id_proyecto:number):void => {
    this.id_proyecto = id_proyecto;
    $('#deleteConfirm').modal('show');
  }

  getDeleteConfirm = (confirm:boolean):void => {
    if(confirm) {
      Swal.fire({
        title:'Espere un momento',
        text:'Eliminando proyecto, por favor, espere...',
        didOpen:() => {
          Swal.showLoading();
        }
      });

      this.adminService.deleteProyectos(this.anio, this.id_proyecto)
      .subscribe(res => {
        Swal.close();
        Swal.fire({
          icon:res.success ? 'success' : 'error',
          title:res.success ? '¡Correcto!' : '¡Error!',
          text:res.msg,
          showConfirmButton:false,
          timer:2300
        }).then(() => {
          this.confirm.emit(true);
        })
      })
    }
  }

}
