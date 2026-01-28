import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environments } from '../../../environments/environments';
import { Res } from '../../auth/interfaces/res.interface';
import { catchError, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CentralService {
  private http = inject(HttpClient);
  private baseUrl = environments.baseUrl;

  loadStorage() {
    return localStorage.getItem('token');
  }

  // getUnidadTerritorial(anio:number, id_distrito:string) {
  //   const headers = new HttpHeaders({
  //     'Authorization' : `Bearer ${this.loadStorage()}`
  //   });

  //   return this.http.post<Res>(`${this.baseUrl}/cat/coloniasConActas`,{anio, id_distrito},{headers})
  //   .pipe(
  //     catchError((res:HttpErrorResponse) => {
  //       if(res.status == 404) {
  //         return of({success:false, msg:'No se encontraron Unidades Territoriales con el distrito seleccionado.', datos:undefined})
  //       } else if(res.status == 0 || res.status == 500) {
  //         return of({success:false, msg:'Se perdió la conexión con el servidor, recargue la página o intente de nuevo la última acción', datos:undefined})
  //       } else {
  //         return of(res.error as Res)
  //       }
  //     })
  //   )
  // }

  getActas(anio:number,id_distrito:number,clave_colonia:string) {
    const headers = new HttpHeaders({
      'Authorization' : `Bearer ${this.loadStorage()}`
    });

    const body = {anio, id_distrito, clave_colonia};

    return this.http.post<Res>(`${this.baseUrl}/central/seguimiento/acta`,body,{headers})
    .pipe(
      catchError((res:HttpErrorResponse) => {
        if(res.status == 404) {
          return of({success:false, msg:'No se encontraron actas registradas para esta Unidad Territorial.', datos:undefined})
        } else if(res.status == 0 || res.status == 500) {
          return of({success:false, msg:'Se perdió la conexión con el servidor, intente de nuevo la última acción', datos:undefined})
        } else {
          return of(res.error as Res)
        }
      })
    )
  }

  deleteActas(id_acta:number, anio:number) {
    const headers = new HttpHeaders({
      'Authorization' : `Bearer ${this.loadStorage()}`
    });

    return this.http.delete<Res>(`${this.baseUrl}/central/seguimiento/acta`,{body:{id_acta, anio},headers})
    .pipe(
      catchError(res => of(res.error as Res))
    )
  }
}
