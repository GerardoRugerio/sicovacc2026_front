import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environments } from '../../../environments/environments';
import { Res } from '../../auth/interfaces/res.interface';
import { catchError, of, tap } from 'rxjs';
import { Actualiza } from '../interfaces/actualiza-datos.interface';

@Injectable({
  providedIn: 'root',
})
export class ActualizaService {
  private http = inject(HttpClient);
  private baseUrl = environments.baseUrl;

  loadStorge() {
    return localStorage.getItem('token');
  }

  getDatosDistrito() {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.loadStorge()}`,
    });

    return this.http.get<Res>(`${this.baseUrl}/distrital/procesos/datosDistrito`,{headers})
    .pipe(
        catchError((res) => of(res.error as Res))
      );
  }

  actualizaDatosDistrito(datos: Actualiza) {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.loadStorge()}`,
    });

    return this.http.put<Res>(`${this.baseUrl}/distrital/procesos/datosDistrito`,datos,{headers})
      .pipe(
        catchError((res) => of(res.error as Res))
      );
  }

  deleteBD() {
    const headers = new HttpHeaders({
      'Authorization' : `Bearer ${this.loadStorge()}`
    });

    return this.http.get<Res>(`${this.baseUrl}/distrital/procesos/limpiarBD`,{headers})
    .pipe(
      catchError(res => of(res.error as Res))
    )
  }
}
