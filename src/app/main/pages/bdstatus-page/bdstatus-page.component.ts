import { Component, inject, OnInit, signal } from '@angular/core';
import { Status } from '../../../auth/interfaces/database-status.interface';
import { DbStatusService } from '../../../auth/services/db-status.service';

import { forkJoin } from 'rxjs';
import { VerificaService } from '../../../auth/services/verifica.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-bdstatus-page',
  templateUrl: './bdstatus-page.component.html',
  styleUrl: './bdstatus-page.component.css'
})
export class BDStatusPageComponent implements OnInit{
  private dbStatus = inject(DbStatusService);
  private verifyService = inject(VerificaService);

  public data = signal<Status | undefined>(undefined);

  ngOnInit(): void {
    this.getStatusDB();
  }

  getStatusDB = ():void => {
    Swal.fire({
      title:'Espere un momento',
      text:'Cargando datos del estado de la BD...',
      allowEscapeKey:false,
      allowOutsideClick:false,
      didOpen:() => {
        Swal.showLoading();
      }
    });

    forkJoin({
      verify: this.verifyService.checkAuthentication(),
      res: this.dbStatus.getDatosStatus()
    }).subscribe(({verify, res}) => {
      if(!verify) return;
      Swal.close();
      this.dbStatus.status.set(res.datos as Status);
      this.data.set(this.dbStatus.status());
    })
  }
}
