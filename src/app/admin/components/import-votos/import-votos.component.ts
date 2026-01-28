import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { Catalogo } from '../../../main/interfaces/catalogo.inteface';
import Swal from 'sweetalert2';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'admin-import-votos',
  templateUrl: './import-votos.component.html',
  styles: ``
})
export class ImportVotosComponent implements OnInit {
  private fb = inject(FormBuilder);
  private adminService = inject(AdminService);

  public form = this.fb.group({
    tipo_eleccion:[''],
    distrito:['TODOS']
  });

  public distritos:Catalogo[] = [];
  public anio:number = 0;

  get input_distrito():FormControl {
    return this.form.get('distrito') as FormControl;
  }

  get input_eleccion():FormControl {
    return this.form.get('tipo_eleccion') as FormControl;
  }

  get distrito():string {
    return this.input_distrito.value;
  }

  get eleccion():string {
    return this.input_eleccion.value;
  }

  ngOnInit():void {
    for(let i = 1; i <= 33; i++) {
      this.distritos.push({id:i.toString(),nombre:i.toString()});
    }
    this.input_eleccion.setValue('1')
  };

  getAnio = (anio:number):void => {
    this.anio = anio;
  }

  getEleccion = ():void => {
    if(this.eleccion == '') {
      this.input_distrito.disable();
    } else {
      this.input_distrito.enable();
    }

    this.input_distrito.setValue('TODOS');
  }

  importDB = (path:string):void => {
    Swal.fire({
      title:'Espere un momento',
      html:`Realizando la importación de ${path == 'importarProyectos' ? 'los Proyectos Participantes' : 'la Votación SEI'} para ${this.input_distrito.value == 'TODOS' ? 'TODOS los distritos' : 'el distrito '+ this.input_distrito.value}, un momento por favor...`,
      allowOutsideClick:false,
      allowEscapeKey:false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    this.adminService.import(this.anio, this.distrito, path)
    .subscribe(res => {
      Swal.close();
      Swal.fire({
        icon:res.success ? 'success' : 'error',
        title:res.success ? '¡Se realizó la importación!' : '¡Ocurrió un error!',
        text: res.msg,
        showConfirmButton:false,
        timer:2500
      })
    })
  }
}
