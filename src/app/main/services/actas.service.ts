// import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
// import { inject, Injectable } from '@angular/core';
// import { environments } from '../../../environments/environments';
// import { Res } from '../../auth/interfaces/res.interface';
// import { catchError, map, Observable, of } from 'rxjs';
// import { Acta, Proyectos } from '../interfaces/captura_resultados_actas.interface';
// import { AuthService } from '../../auth/services/auth.service';
// import { EncryptService } from '../../shared/services/encrypt.service';

// @Injectable({
//   providedIn: 'root'
// })
// export class ActasService {
//   private http = inject(HttpClient);
//   private baseUrl = environments.baseUrl;
//   private authService = inject(AuthService);
//   private encryptService = inject(EncryptService);

//   get loadStorage():string {
//     return localStorage.getItem('token')!;
//   }

//   getListaActas(anio:number) {
//     const headers = new HttpHeaders({
//       'Authorization' : `Bearer ${this.loadStorage}`
//     });

//     return this.http.get<Res>(`${this.baseUrl}/distrital/seguimiento/resultadoConsultaMesa?anio=${anio}`,{headers})
//     .pipe(
//       catchError((res:HttpErrorResponse) => {
//         if(res.status == 0 || res.status == 500) {
//           return of({success:false, msg:'Se perdió la conexión con el servidor.', datos:[]})
//         } else {
//           return of(res.error as Res)
//         }
//       },
//     ))
//   }

//   getInfoActa(anio:number, id_acta:number):Observable<Res> {
//     const headers = new HttpHeaders({
//       'Authorization' : `Bearer ${this.loadStorage}`
//     });

//     return this.http.get<Res>(`${this.baseUrl}/distrital/seguimiento/acta/${id_acta}?anio=${anio}`,{headers})
//     .pipe(
//       map(res => ({...res, datos: this.encryptService.decrypt(res.datos as any)})),
//       catchError(res => of(res.error as Res))
//     )
//   }

//   getDatosActa(anio:number, clave_colonia:string, num_mro:string, tipo_mro:number):Observable<Res> {
//     const headers = new HttpHeaders({
//       'Authorization' : `Bearer ${this.loadStorage}`
//     });

//     const body = {anio, clave_colonia, num_mro, tipo_mro};
//     return this.http.post<Res>(`${this.baseUrl}/distrital/seguimiento/resultadoConsultaMesa`,body,{headers})
//     .pipe(
//       anio
//       catchError(res => of(res.error as Res))
//     )
//   }

//   saveActa(acta:Acta, anio:number, clave_colonia:string, tipo_mro:number, num_mro:number,
//     bol_total_emitidas:number, opi_total_sei:number, option:number, forzar:boolean,
//     id_incidencia:number | undefined = undefined, id_acta:number | undefined = undefined):Observable<Res> {
//     const num_integrantes = acta.coordinador_sino ? acta.num_integrantes : '';
//     const body = {...acta, anio, clave_colonia, tipo_mro, num_mro, bol_total_emitidas, opi_total_sei,
//       num_integrantes, forzar, id_incidencia, id_acta};

//     const headers = new HttpHeaders({
//       'Authorization' : `Bearer ${
//         option == 1 ? this.loadStorage :(this.authService.rol == 1 ? this.loadStorage : this.authService.tokenTitular)
//       }`});

//     if(option == 1) {
//       return this.http.post<Res>(`${this.baseUrl}/distrital/seguimiento/acta`,{payload:
//         this.encryptService.encrypt(body)}, {headers})
//       .pipe(
//         catchError(res => of(res.error as Res))
//       )
//     } else {
//       return this.http.put<Res>(`${this.baseUrl}/distrital/seguimiento/acta`,{payload:
//         this.encryptService.encrypt(body)}, {headers})
//       .pipe(
//         catchError(res => of(res.error as Res))
//       )
//     }
//   }
// }

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environments } from '../../../environments/environments';
import { AuthService } from '../../auth/services/auth.service';
import { EncryptService } from '../../shared/services/encrypt.service';
import { catchError, map, Observable, of } from 'rxjs';
import { Res } from '../../auth/interfaces/res.interface';
import { Acta } from '../interfaces/captura_resultados_actas.interface';

@Injectable({
  providedIn: 'root'
})
export class ActasService {
  private baseUrl = environments.baseUrl;
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private encryptService = inject(EncryptService);

  private get token():string {return localStorage.getItem('token') ?? ''};
  private get rol():number {return this.authService.rol()!};

  getActa(anio:number, id_acta:number):Observable<Res> {
    const headers = new HttpHeaders({
      'Authorization' : `Bearer ${this.token}`
    });

    return this.http.get<Res>(`${this.baseUrl}/distrital/seguimiento/acta/${id_acta}?anio=${anio}`,{headers})
    .pipe(
      map(res => ({...res, datos: this.encryptService.decrypt(res.datos as any)})),
      catchError(res => of(res.error as Res))
    )
  }

  getActas(anio:number):Observable<Res> {
    const headers = new HttpHeaders({
      'Authorization' : `Bearer ${this.token}`
    });

    return this.http.get<Res>(`${this.baseUrl}/distrital/seguimiento/resultadoConsultaMesa?anio=${anio}`,{headers})
    .pipe(
      catchError(res => of(res.error as Res))
    )
  }

  getDatos(anio:number, clave_colonia:string, num_mro:number, tipo_mro:number):Observable<Res> {
    const headers = new HttpHeaders({
      'Authorization' : `Bearer ${this.token}`
    });

    const body = {anio, clave_colonia, num_mro, tipo_mro};
    return this.http.post<Res>(`${this.baseUrl}/distrital/seguimiento/resultadoConsultaMesa`,body,{headers})
    .pipe(
      map(res => ({...res, datos: this.encryptService.decrypt(res.datos as any)})),
      catchError(res => of(res.error as Res))
    )
  }

  saveDatos(acta: Acta, anio:number, bol_total_emitidas:number, opi_total_sei:number, forzar:boolean, id_incidencia:number | undefined = undefined, id_acta:number | undefined = undefined):Observable<Res> {
    const num_mro = acta.num_mro.split('-')[0];
    const tipo_mro = acta.num_mro.split('-')[1];
    const num_integrantes = acta.coordinador_sino ? acta.num_integrantes : 0;

    const body = {...acta, anio, num_mro, tipo_mro, num_integrantes, bol_total_emitidas, opi_total_sei, forzar, id_incidencia, id_acta};
    const headers = new HttpHeaders({
      'Authorization' : `Bearer ${this.rol == 1 || id_acta == undefined ? this.token : this.authService.tokenTitular()}`
    });

    if(id_acta == undefined) {
      return this.http.post<Res>(`${this.baseUrl}/distrital/seguimiento/acta`,body,{headers})
      .pipe(
        catchError(res => of(res.error as Res))
      )
    } else {
      return this.http.put<Res>(`${this.baseUrl}/distrital/seguimiento/acta`,body,{headers})
      .pipe(
        catchError(res => of(res.error as Res))
      )
    }
  }
}
