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

  downloadReportes(url:string) {
    const path = `${this.baseUrl}/central/reportes/${url}`;
    return this.http.get<Reporte>(path)
    .pipe(
      catchError(res => of(res.error as Reporte))
    )
  }
}
