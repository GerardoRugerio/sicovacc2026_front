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
    const num_mro = id_acta !== undefined ? undefined : acta.num_mro.split('-')[0];
    const tipo_mro = id_acta !== undefined ? undefined : acta.num_mro.split('-')[1];
    const num_integrantes = acta.coordinador_sino ? acta.num_integrantes : 0;

    const body = {...acta, anio, num_mro, tipo_mro, num_integrantes, bol_total_emitidas, opi_total_sei, forzar, id_incidencia, id_acta};
    const headers = new HttpHeaders({
      'Authorization' : `Bearer ${this.rol == 1 || id_acta == undefined ? this.token : this.authService.tokenTitular()}`
    });

    if(id_acta == undefined) {
      return this.http.post<Res>(`${this.baseUrl}/distrital/seguimiento/acta`,{payload: this.encryptService.encrypt(body)},{headers})
      .pipe(
        catchError(res => of(res.error as Res))
      )
    } else {
      return this.http.put<Res>(`${this.baseUrl}/distrital/seguimiento/acta`,{payload: this.encryptService.encrypt(body)},{headers})
      .pipe(
        catchError(res => of(res.error as Res))
      )
    }
  }
}
