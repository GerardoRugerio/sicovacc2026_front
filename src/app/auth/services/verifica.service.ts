// import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
// import { Injectable, inject } from '@angular/core';
// import { Res } from '../interfaces/res.interface';
// import { environments } from '../../../environments/environments';
// import { catchError, map, of, tap } from 'rxjs';
// import { AuthService } from './auth.service';
// import { WebsocketService } from '../../shared/services/websocket.service';
// import Swal from 'sweetalert2';

// @Injectable({
//   providedIn: 'root'
// })
// export class VerificaService {
//   private http = inject(HttpClient);
//   private baseUrl = environments.baseUrl;
//   private authService = inject(AuthService);
//   private webSocketService = inject(WebsocketService);

//   get loadStorage():string {
//     return localStorage.getItem('token')!;
//   }

//   checkAuthentication() {
//     const headers = new HttpHeaders({
//       'Authorization' : `Bearer ${this.loadStorage}`
//     });

//     return this.http.get<Res>(`${this.baseUrl}/verify`,{ headers })
//     .pipe(
//       tap(res => {
//         if(!res.success) {
//           if(!res.msg?.match('Token verificado')) {
//             Swal.fire({
//               icon:'error',
//               title:'¡Error!',
//               text: res.msg,
//               confirmButtonText:'Entendido'
//             });
//           }
//           return;
//         }

//         this.authService.inicioValidacion = res.inicioValidacion;
//         this.authService.cierreValidacion = res.cierreValidacion;
//         this.authService.ocultaOpcion = res.opcion !== null ? res.opcion : 0;

//         if(res.token) {
//           localStorage.setItem('token',res.token!);
//           localStorage.setItem('iV',JSON.stringify(res.inicioValidacion));
//           localStorage.setItem('iC',JSON.stringify(res.cierreValidacion));
//           localStorage.setItem('o',JSON.stringify(res.opcion));
//           this.authService.decodeStorage();
//           localStorage.setItem('id_transaccion',this.authService.id_transaccion!.toString());
//         }
//         this.webSocketService.emit('configurar-usuario', { id_transaccion:this.authService.id_transaccion});
//       }),
//       map(res => res.success),
//       catchError((res:HttpErrorResponse) => {
//         if(this.loadStorage) {
//           if(res.status == 401) {
//             Swal.fire({
//               icon: 'warning',
//               title: '¡Sesión expirada!',
//               text: 'Se agotó el tiempo de la sesión, es necesario volver a ingresar con sus credenciales de acceso.',
//               confirmButtonText: 'Confirmar',
//               allowEscapeKey:false,
//               allowOutsideClick:false
//             }).then(() => {
//               localStorage.clear();
//               location.reload();
//             })
//             return of(false);
//           } else if(res.status == 403) {
//             Swal.fire({
//               icon: 'warning',
//               title: '¡Usuario inactivo!',
//               text: 'Este usuario ha sido dado de baja, si requiere volver a tener acceso con este usuario comuniquese con el departamento de servicios informáticos',
//               confirmButtonText: 'Confirmar',
//               allowEscapeKey:false,
//               allowOutsideClick:false
//             }).then(() => {
//               localStorage.clear();
//               location.reload();
//             })
//             return of(false);
//           } else if(res.status == 409) {
//             Swal.fire({
//               icon: 'warning',
//               title: '¡Atención!',
//               text: 'La sesión guardada en este equipo con este usuario ha sido terminada debido a que se inició sesión desde otro equipo o navegador.',
//               confirmButtonText: 'Confirmar',
//               allowEscapeKey:false,
//               allowOutsideClick:false
//             }).then(() => {
//               localStorage.clear();
//               location.reload();
//             })
//             return of(false);
//           } else if (res.status == 0 || res.status == 500) {
//             Swal.fire({
//               icon:'warning',
//               title:'¡Acción no completada!',
//               html:`Se ha perdido la conexión con el servidor, <b>¡intentar de nuevo la última acción!</b>`,
//               confirmButtonText:'Aceptar',
//               allowEscapeKey:false,
//               allowOutsideClick:false
//             })
//             return of(false);
//           } else {
//             return of(false);
//           }
//         } else {
//           return of(false);
//         }
//       })
//     )
//   }
// }

import { HttpClient, HttpErrorResponse, HttpHeaderResponse, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environments } from '../../../environments/environments';
import { AuthService } from './auth.service';
import { WebsocketService } from '../../shared/services/websocket.service';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { Res } from '../interfaces/res.interface';
import Swal from 'sweetalert2';


@Injectable({
  providedIn: 'root'
})
export class VerificaService {
  private baseUrl = environments.baseUrl;
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private webSocketService = inject(WebsocketService);

  private message = (icon:'error' | 'warning', title:string, text:string, confirmButtonText:string, redirect:boolean = false):void => {
    Swal.fire({
      icon,
      title,
      text,
      confirmButtonText
    }).then(() => {
      if(redirect) {
        localStorage.clear();
        location.reload();
      }
    })
  }

  getToken = ():string | null => localStorage.getItem('token');

  checkAuthentication():Observable<boolean> {
    const headers = new HttpHeaders({
      'Authorization' : `Bearer ${this.getToken()}`
    });

    return this.http.get<Res>(`${this.baseUrl}/verify`,{headers})
    .pipe(
      tap(res => {
        if(!res.success) {
          if(!res.msg?.match('Token verificado')) {
            this.message('error','¡Error!', res.msg!, 'Entendido', false);
          }
          return;
        }
        this.authService.inicioValidacion.set(res.inicioValidacion!);
        this.authService.cierreValidacion.set(res.cierreValidacion!);
        this.authService.ocultaOpcion.set(res.opcion ?? 0);

        if(res.token) {
          localStorage.setItem('token',res.token!);
          this.authService.token.set(res.token!);
          this.authService.decodeStorage();
          localStorage.setItem('id_transaccion', String(this.authService.id_transaccion()));
          this.webSocketService.emit('configurar-usuario', {id_transaccion: this.authService.id_transaccion()});
        }
      }),
      map(res => res.success),
      catchError((res:HttpErrorResponse) => {
        if(this.getToken()) {
          if(res.status ==  401) {
            this.message('warning','¡Sesión expirada!','Se agotó el tiempo de la sesión, es necesario volver a ingresar con sus credenciales de acceso.','Confirmar', true);
            return of(false);
          } else if(res.status == 403) {
            this.message('warning','¡Usuario inactivo!','Este usuario ha sido dado de baja, si requiere volver a tener acceso con este usuario comuniquese con el departamento de servicios informáticos','Confirmar', true);
            return of(false);
          } else if(res.status == 409) {
            this.message('warning','¡Atención!','La sesión guardada en este equipo con este usuario ha sido terminada debido a que se inició sesión desde otro equipo o navegador.','Confirmar', true);
            return of(false);
          } else if(res.status == 0 || res.status == 500) {
            this.message('warning','¡Acción no completada!','Se ha perdido la conexión con el servidor, ¡intentar de nuevo la última acción!','Aceptar');
            return of(false);
          } else {
            return of(false);
          }
        } else {
          return of(false);
        }
      })
    )
  }
}
