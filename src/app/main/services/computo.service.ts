import { HttpClient, HttpHeaders } from '@angular/common/http';
import { computed, inject, Injectable } from '@angular/core';
import { Res } from '../../auth/interfaces/res.interface';
import { environments } from '../../../environments/environments';
import { catchError, Observable, of, tap } from 'rxjs';
import { Computo, Mesa } from '../interfaces/inicio-computo.interface';
import { AuthService } from '../../auth/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ComputoService {
  private http = inject(HttpClient);
  private baseUrl = environments.baseUrl;
  private authService = inject(AuthService);

  private get token():string {return localStorage.getItem('token') || ''};

  saveNoInstaladas(mesas:Mesa[], anio:number):Observable<Res> {
    const headers = new HttpHeaders({
      'Authorization' : `Bearer ${this.token}`
    });

    return this.http.put<Res>(`${this.baseUrl}/distrital/seguimiento/mesasInstaladas`,{mesas, anio},{headers})
    .pipe(
      catchError(res => of(res.error as Res))
    )
  }

  getMesasInstaladas() {
    const headers = new HttpHeaders({
      'Authorization' : `Bearer ${this.token}`
    });
    return this.http.get<Res>(`${this.baseUrl}/distrital/seguimiento/mesasInstaladas`,{headers})
    .pipe(
      catchError(res => of(res.error as Res)
    ))
  }

  getDatosComputo(path:string) {
    const headers = new HttpHeaders({
      'Authorization' : `Bearer ${this.token}`
     });

     return this.http.get<Res>(`${this.baseUrl}/distrital/seguimiento/${path}`,{headers})
     .pipe(
      catchError(res => of(res.error as Res))
     )
  }

  setComputo(total:number , valores:Computo, option:number, path:string) {
    const headers = new HttpHeaders({
      'Authorization' : `Bearer ${this.token}`
    });
    const body = {...valores, total};
    if(option == 1) {
      return this.http.post<Res>(`${this.baseUrl}/distrital/seguimiento/${path}`,body,{headers})
      .pipe(
        catchError(res => of(res.error as Res))
      );
    } else {
      return this.http.put<Res>(`${this.baseUrl}/distrital/seguimiento/${path}`,body,{headers})
      .pipe(
        catchError(res => of(res.error as Res))
      );
    }
  }
}
