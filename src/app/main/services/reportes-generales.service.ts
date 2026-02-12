import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { computed, inject, Injectable } from '@angular/core';
import { AuthService } from '../../auth/services/auth.service';
import { environments } from '../../../environments/environments';
import { catchError, Observable, of } from 'rxjs';
import { Reporte } from '../interfaces/reportes.interface';

@Injectable({
  providedIn: 'root'
})
export class ReportesGeneralesService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private baseUrl = environments.baseUrl;

  private distrito = computed(() => this.authService.distrito());

  downloadReporte = (anio:number, params:string, clave_colonia:string | undefined = undefined, post:boolean | undefined = undefined) => {
    if(!post) {
      if(params != 'inicioCierreValidacion' && params != 'incidentesDistrito') {
        return this.http.get<Reporte>(`${this.baseUrl}/distrital/reportes/${anio > 1 ? 'consulta' : 'eleccion'}/${params}/${this.distrito()}?anio=${anio}`)
        .pipe(
          catchError((res:HttpErrorResponse) => {
            if(res.status == 0) {
              return of({success:false, msg:'Se perdió la conexión', contentType:'', reporte:'', buffer:undefined})
            } else {
              return of(res.error as Reporte)
            }
          })
        )
      } else {
        return this.http.get<Reporte>(`${this.baseUrl}/distrital/reportes/${params}/${this.distrito()}?anio=${anio}`)
        .pipe(
          catchError((res:HttpErrorResponse) => {
            if(res.status == 0) {
              return of({success:false, msg:'Se perdió la conexión', contentType:'', reporte:'', buffer:undefined})
            } else {
              return of(res.error as Reporte)
            }
          })
        )
      }
    } else {
      return this.http.post<Reporte>(`${this.baseUrl}/distrital/reportes/${anio > 1 ? 'consulta' : 'eleccion'}/${params}/${this.distrito()}`,{anio, clave_colonia})
      .pipe(
        catchError((res:HttpErrorResponse) => {
          if(res.status == 0) {
            return of({success:false,msg:'Se perdió la conexión', contentType:'',reporte:'',buffer:undefined})
          } else {
            return of(res.error as Reporte)
          }
        })
      )
    }
  }

  downloadReporteUT(anio:number,path:string, clave_colonia:string | undefined = undefined) {
    const url = `${this.baseUrl}/distrital/reportes/${path}/${this.distrito()}`;
    return this.http.post<Reporte>(url,{anio, clave_colonia})
    .pipe(
      catchError(res => of(res.error as Reporte))
    )
  }

  downloadProyectosP(anio:number, params:string, clave_colonia:string, tipo:string | undefined = undefined) {
    return this.http.post<Reporte>(`${this.baseUrl}/distrital/reportes/${anio > 1 ? 'consulta' : 'eleccion'}/${params}/${this.distrito()}`,{anio, clave_colonia, tipo})
    .pipe(
      catchError(res => of(res.error as Reporte))
    )
  }

  downloadConstancias(anio:number, clave_colonia:string, tipo:string) {
    const body = {anio, clave_colonia,tipo}
    return this.http.post<Reporte>(`${this.baseUrl}/distrital/reportes/${anio > 1 ? 'consulta' : 'eleccion'}/${this.distrito()}`,body)
    .pipe(
      catchError(res => of(res.error as Reporte))
    )
  }
}
