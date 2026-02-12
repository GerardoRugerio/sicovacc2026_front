import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { environments } from '../../../environments/environments';
import { Res } from '../../auth/interfaces/res.interface';
import { catchError, Observable, of } from 'rxjs';
import { Catalogo } from '../interfaces/catalogo.inteface';

@Injectable({
  providedIn: 'root'
})
export class CatalogosService {
  private http = inject(HttpClient);
  private baseUrl = environments.baseUrl;

  //Obtención del token desde LocalStorage
  private get token():string {return localStorage.getItem('token') || '';}

  public listaEleccion = signal<Catalogo[] | undefined>(undefined);

  //Función general para obtener catálogos y algunos objetos específicos, según el path proporcionado y los parámetros opcionales.
  getCatalogo = (path:string, clave_colonia:string | undefined = undefined, anio:number | undefined = undefined, id_distrito:number | undefined = undefined):Observable<Res> => {
    const headers = new HttpHeaders({
      'Authorization' : `Bearer ${this.token}`
    });
    const body = {clave_colonia, anio, id_distrito};
    if(path == 'tipoEleccion') {
      return this.http.get<Res>(`${this.baseUrl}/cat/${path}`,{headers})
      .pipe(
        catchError(res => of(res.error as Res))
      )
    } else {
      let url = '';
      if(path == 'proyectos' || path == 'formulas') {
        url = `${this.baseUrl}/distrital/reportes`;
      } else {
        url = `${this.baseUrl}/cat`;
      }
      return this.http.post<Res>(`${url}/${path}`,body,{headers})
      .pipe(
        catchError(res => of(res.error as Res))
      )
    }
  }
 }
