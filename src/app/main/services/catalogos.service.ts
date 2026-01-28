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
  private token = computed(() => localStorage.getItem('token'));
  public listaEleccion = signal<Catalogo[] | undefined>(undefined);

  // getTerritorialCatalogos(anio:number, id_distrito:number | undefined = undefined) {
  //   const headers = new HttpHeaders({
  //     'Authorization' : `Bearer ${this.token()}`
  //   });

  //   const body = {anio, id_distrito};

  //   return this.http.post<Res>(`${this.baseUrl}/cat/colonias`,body,{headers})
  //   .pipe(
  //     catchError((res:HttpErrorResponse) => {
  //       if(res.status == 0 || res.status == 500) {
  //         return of({success:false, msg: 'Se perdió la conexión con el servidor.', datos: []});
  //       } else {
  //         return of(res.error as Res)
  //       }
  //     })
  //   );
  // }

  // getTerritorialCatalogosSinActa(anio:number) {
  //   const headers = new HttpHeaders({
  //     'Authorization' : `Bearer ${this.token()}`
  //   });

  //   return this.http.post<Res>(`${this.baseUrl}/cat/coloniasSinActas`,{anio},{headers})
  //   .pipe(
  //     catchError(res => of(res.error as Res))
  //   )
  // }

  // getListaProyectos(anio:number, clave_colonia:string) {
  //   const headers = new HttpHeaders({
  //     'Authorization' : `Bearer ${this.token()}`
  //   });

  //   return this.http.post<Res>(`${this.baseUrl}/distrital/reportes/proyectos`,{anio,clave_colonia},{headers})
  //   .pipe(
  //     catchError((res:HttpErrorResponse) => {
  //       if(res.status == 0 || res.status == 500) {
  //       return of({success:false, msg: 'Se perdió la conexión con el servidor.', datos:[]})
  //       } else {
  //         return of(res.error as Res)
  //       }
  //     })
  //   )
  // }

  // getListaMesasCol(clave_colonia:string) {
  //   const headers = new HttpHeaders({
  //     'Authorization' : `Bearer ${this.token()}`
  //   });

  //   return this.http.post<Res>(`${this.baseUrl}/cat/mesasSinActas`,{clave_colonia},{headers})
  //   .pipe(
  //     catchError(res => of(res.error as Res))
  //   )
  // }

  // getMesas(clave_colonia:string) {
  //   const headers = new HttpHeaders({
  //     'Authorization' : `Bearer ${this.token()}`
  //   });

  //   return this.http.post<Res>(`${this.baseUrl}/cat/mesas`,{clave_colonia},{headers})
  //   .pipe(
  //     catchError(res => of(res.error as Res))
  //   )
  // }

  // getDelegacion(clave_colonia:string) {
  //   const headers = new HttpHeaders({
  //     'Authorization' : `Bearer ${this.token()}`
  //   });

  //   return this.http.post<Res>(`${this.baseUrl}/cat/delegacion`,{clave_colonia},{headers})
  //   .pipe(
  //     catchError(res => of(res.error as Res))
  //   )
  // }

  //Función general para obtener catálogos y algunos objetos específicos, según el path proporcionado y los parámetros opcionales.
  getCatalogo(path:string, clave_colonia:string | undefined = undefined, anio:number | undefined = undefined, id_distrito:number | undefined = undefined):Observable<Res> {
    const headers = new HttpHeaders({
      'Authorization' : `Bearer ${this.token()}`
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
