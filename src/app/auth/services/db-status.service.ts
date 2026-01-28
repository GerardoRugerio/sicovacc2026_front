import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { environments } from '../../../environments/environments';
import { Status } from '../interfaces/database-status.interface';
import { catchError, Observable, of } from 'rxjs';
import { Res } from '../interfaces/res.interface';

@Injectable({
  providedIn: 'root'
})
export class DbStatusService {
  private http = inject(HttpClient);
  private baseUrl = environments.baseUrl;

  public status = signal<Status | undefined>(undefined);

  public conteoCopaco = computed(() => this.status()?.conteo.conteo_C || 0);
  public conteoCc1 = computed(() => this.status()?.conteo.conteo_CC1 || 0);
  public conteoCc2 = computed(() => this.status()?.conteo.conteo_CC2 || 0);

  private get token():string {return localStorage.getItem('token') || ''};

  getDatosStatus = () => {
    const headers = new HttpHeaders({
      'Authorization' : `Bearer ${this.token}`
    });

    return this.http.get<Res>(`${this.baseUrl}/distrital/seguimiento/estadoBD`,{headers})
    .pipe(
      catchError((res:HttpErrorResponse)  =>  {
        if(res.status == 0) {
          return of({success: false, msg: 'Se ha perdido la conexión con el servidor', datos: []});
        } else {
          return of(res.error as Res);
        }
      })
    )
  }
}
