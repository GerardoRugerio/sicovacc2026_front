import { inject, Injectable } from '@angular/core';
import { environments } from '../../../environments/environments';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, of } from 'rxjs';
import { Res } from '../../auth/interfaces/res.interface';
import { Catalogo } from '../interfaces/catalogo.inteface';

@Injectable({
  providedIn: 'root'
})
export class EleccionesService {
  private baseUrl = environments.baseUrl;
  private http = inject(HttpClient);

  public listaEleccion: Catalogo[] | undefined;

  get loadStorage():string {
    return localStorage.getItem('token')!;
  }

  getTiposEleccion():Observable<Res> {
    const headers = new HttpHeaders({
      'Authorization' : `Bearer ${this.loadStorage}`
    });

    return this.http.get<Res>(`${this.baseUrl}/cat/tipoEleccion`,{headers})
    .pipe(
      catchError(res => of(res.error as Res))
    )
  }
}
