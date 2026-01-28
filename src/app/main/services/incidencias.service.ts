import { computed, inject, Injectable} from '@angular/core';
import { environments } from '../../../environments/environments';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../auth/services/auth.service';
import { catchError, Observable, of } from 'rxjs';
import { Res } from '../../auth/interfaces/res.interface';
import { Incidencia } from '../interfaces/incidentes.interface';

@Injectable({
  providedIn: 'root'
})
export class IncidenciasService {
  private baseUrl = environments.baseUrl;
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  // private get rol():number {return this.authService.rol!};
  // private get token():string {return localStorage.getItem('token')!};
  private rol = computed(() => this.authService.rol());
  private token = computed(() => localStorage.getItem('token'));

  getListaIncidencias(anio:number):Observable<Res> {
    const headers = new HttpHeaders({
      'Authorization' : `Bearer ${this.token()}`
    });
    return this.http.get<Res>(`${this.baseUrl}/distrital/seguimiento/Incidentes?anio=${anio}`,{headers})
    .pipe(
      catchError(res => of(res.error as Res))
    )
  }

  saveIncidente(incidencia:Incidencia, anio:number):Observable<Res> {
    const num_mro = +incidencia.num_mro.split('-')[0];
    const tipo_mro = +incidencia.num_mro.split('-')[1];
    const body = {...incidencia, num_mro,tipo_mro, anio};
    const headers = new HttpHeaders({
      'Authorization' : `Bearer ${this.token()}`
    });
    if(incidencia.id_incidente !== undefined) {
      return this.http.put<Res>(`${this.baseUrl}/distrital/seguimiento/incidentes`,body,{headers})
      .pipe(
        catchError(res => of(res.error as Res))
      );
    } else {
      return this.http.post<Res>(`${this.baseUrl}/distrital/seguimiento/incidentes`,body,{headers})
      .pipe(
        catchError(res => of(res.error as Res))
      );
    }
  }

  deleteIncidente = (id_incidente:number):Observable<Res> => {
    const headers = new HttpHeaders({
      'Authorization' :
      `Bearer ${this.rol() !== 1 ? this.authService.tokenTitular() : this.token()}`
    });
    return this.http.delete<Res>(`${this.baseUrl}/distrital/seguimiento/incidentes`,{body:{id_incidente},headers})
    .pipe(
      catchError(res => of(res.error as Res))
    )
  }
}

