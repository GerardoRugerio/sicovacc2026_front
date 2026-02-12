import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable, computed, inject } from '@angular/core';
import { environments } from '../../../environments/environments';
import { Res } from '../../auth/interfaces/res.interface';
import { catchError, of } from 'rxjs';
import { Reporte } from '../../main/interfaces/reportes.interface';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private http = inject(HttpClient);
  private baseUrl = environments.baseUrl;

  private get token():string {return localStorage.getItem('token') || ''};

  getUsuariosConectados() {
    const headers = new HttpHeaders({
      'Authorization' : `Bearer ${this.token}`
    });

    return this.http.get<Res>(`${this.baseUrl}/administrador/listaUsuarios`,{headers})
    .pipe(
      catchError((res:HttpErrorResponse) => {
        return of(res.error as Res)
      })
    )
  }

  import(anio:number, id_distrito:string, path:string) {
    const headers = new HttpHeaders({
      'Authorization' : `Bearer ${this.token}`
    });

    const body = {anio,id_distrito};

    return this.http.post<Reporte>(`${this.baseUrl}/administrador/${path}`,body,{headers})
    .pipe(
      catchError((res:HttpErrorResponse) => {
        if(res.status == 0 || res.status == 500) {
          return of({success:false, msg:'Se ha perdido la conexión con el servidor.'})
        } else {
          return of((res.error as Reporte))
        }
      })
    );
  }

  getListaProyectos(anio:number, id_distrito:number, clave_colonia:string) {
    const body = {anio, id_distrito, clave_colonia}
    const headers = new HttpHeaders({
      'Authorization' : `Bearer ${this.token}`
    });

    return this.http.post<Res>(`${this.baseUrl}/administrador/eliminarProyectos`,body,{headers})
    .pipe(
      catchError(res => of(res.error as Res))
    );
  }

  deleteProyectos(anio:number, id_proyecto:number) {
    const headers = new HttpHeaders({
      'Authorization' : `Bearer ${this.token}`
    });

    return this.http.delete<Res>(`${this.baseUrl}/administrador/eliminarProyectos`,{body:{anio, id_proyecto},headers})
    .pipe(
      catchError(res => of(res.error as Res))
    )
  }
}
