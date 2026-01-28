import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environments } from '../../../environments/environments';
import { Reporte } from '../../main/interfaces/reportes.interface';
import { catchError, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DownloadService {
  private http = inject(HttpClient);
  private baseUrl = environments.baseUrl;

  downloadReportes(anio:number, path:string) {
    const url = `${this.baseUrl}/central/reportes/${path}`;
    return this.http.get<Reporte>(url,{params:{anio}})
    .pipe(
      catchError(res => of(res.error as Reporte))
    )
  }
}
