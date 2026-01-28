// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { inject, Injectable } from '@angular/core';
// import { User } from '../interfaces/user.interface';
// import { environments } from '../../../environments/environments';
// import { catchError, Observable, of, tap } from 'rxjs';
// import { Res } from '../interfaces/res.interface';
// import { jwtDecode } from 'jwt-decode';
// import { Token } from '../interfaces/token.interface';
// import { Router } from '@angular/router';
// import { WebsocketService } from '../../shared/services/websocket.service';
// import { EncryptService } from '../../shared/services/encrypt.service';

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthService {
//   private baseUrl = environments.baseUrl;
//   private router = inject(Router);
//   private webSocketService = inject(WebsocketService);
//   private http = inject(HttpClient);
//   private encryptService = inject(EncryptService);


//   public inicioValidacion?:boolean;
//   public cierreValidacion?:boolean;
//   public ocultaOpcion?: number;
//   public tokenTitular:string = '';
//   public show_sidebar:boolean = false;
//   private data!:Token | null;

//   get id_transaccion() {
//     return this.data?.id_transaccion;
//   }

//   get user() {
//     return this.data?.usuario;
//   }

//   get nombre() {
//     return this.data?.nombre;
//   }

//   get distrito() {
//     return this.data?.id_distrito;
//   }

//   get delegacion() {
//     return this.data?.nombre_delegacion;
//   }

//   get rol() {
//     return this.data?.perfil;
//   }

//   constructor() {
//     this.decodeStorage();
//   }

//   decodeStorage = ():void => {
//     if(!this.localStorage()) {
//       this.data = null;
//       return;
//     }

//     this.data = jwtDecode<Token>(this.localStorage())
//   }

//   private localStorage() {
//     return localStorage.getItem('token')!;
//   }

//   login = (login:User):Observable<Res> => {
//     return this.http.post<Res>(`${this.baseUrl}/login`,{payload: this.encryptService.encrypt(login)})
//     .pipe(
//       tap(res => {
//         if(!res.success) {
//           return;
//         }

//         localStorage.setItem('token',res.token!);
//         localStorage.setItem('iV',JSON.stringify(res.inicioValidacion));
//         localStorage.setItem('iC',JSON.stringify(res.cierreValidacion));
//         localStorage.setItem('o',JSON.stringify(res.opcion));
//         this.inicioValidacion = res.inicioValidacion;
//         this.cierreValidacion = res.cierreValidacion;
//         this.ocultaOpcion = res.opcion !== null ? res.opcion : 0;
//         this.decodeStorage();
//         localStorage.setItem('id_transaccion', this.id_transaccion!.toString())
//         this.webSocketService.emit('configurar-usuario', {id_transaccion: this.id_transaccion});
//       }),
//       catchError(res => of(res.error as Res))
//     )
//   }

//   loginTitular = (user:User):Observable<Res> => {
//     const headers = new HttpHeaders({
//       'Authorization' : `Bearer ${localStorage.getItem('token')}`
//     });
//     return this.http.post<Res>(`${this.baseUrl}/loginTitular`,{payload: this.encryptService.encrypt(user)},{headers})
//     .pipe(
//       tap(res => {
//         this.tokenTitular = res.token!;
//       }),
//       catchError(res => of(res.error as Res))
//     )
//   }

//   logout = (reload:boolean = false):void => {
//     this.clearStorage();
//     this.router.navigateByUrl('auth');
//     if(reload)
//     location.reload();
//   }

//   clearStorage = ():void => {
//     this.data = null;
//     localStorage.clear();
//     this.webSocketService.emit('logout');
//   }
// }

import { computed, inject, Injectable, signal } from '@angular/core';
import { environments } from '../../../environments/environments';
import { HttpClient, HttpHeaderResponse, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { WebsocketService } from '../../shared/services/websocket.service';
import { EncryptService } from '../../shared/services/encrypt.service';
import { Token } from '../interfaces/token.interface';
import { jwtDecode } from 'jwt-decode';
import { catchError, Observable, of, tap } from 'rxjs';
import { Res } from '../interfaces/res.interface';
import { User } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = environments.baseUrl;
  private http = inject(HttpClient);
  private router = inject(Router);
  private webSocketService = inject(WebsocketService);
  private encryptService = inject(EncryptService);

  public token = signal<string>('');
  public tokenTitular = signal<string>('');
  public inicioValidacion = signal<boolean | null>(null);
  public cierreValidacion = signal<boolean | null>(null)
  public ocultaOpcion = signal<number | null>(null);
  private data = signal<Token | undefined>(undefined);

  public id_transaccion = computed(() => this.data()?.id_transaccion);
  public user = computed(() => this.data()?.usuario);
  public nombre = computed(() => this.data()?.nombre);
  public distrito = computed(() => this.data()?.id_distrito)
  public delegacion = computed(() => this.data()?.nombre_delegacion);
  public rol = computed(() => this.data()?.perfil);

  constructor() {
    this.decodeStorage();
  }

  decodeStorage = ():void => {
    if(!this.getToken()) {
      this.data.set(undefined);
      return;
    }
    this.data.set(jwtDecode<Token>(this.getToken()!));
  }

  getToken = ():string | null => localStorage.getItem('token');

  login = (user:User):Observable<Res> => {
    return this.http.post<Res>(`${this.baseUrl}/login`, {payload: this.encryptService.encrypt(user)})
    .pipe(
      tap(res => {
        if(!res.success) {
          return;
        }

        localStorage.setItem('token',res.token!);
        this.token.set(res.token!);
        this.inicioValidacion.set(res.inicioValidacion!);
        this.cierreValidacion.set(res.cierreValidacion!);
        this.ocultaOpcion.set(res.opcion ?? 0);
        this.decodeStorage();
        localStorage.setItem('id_transaccion', String(this.id_transaccion()));
        this.webSocketService.emit('configurar-usuario', {id_transaccion: this.id_transaccion()});
      }),
      catchError(res => of(res.error as Res))
    )
  }

  loginTitular = (user:User):Observable<Res> => {
    const headers = new HttpHeaders({
      'Authorization' : `Bearer ${this.getToken()}`
    });

    return this.http.post<Res>(`${this.baseUrl}/loginTitular`,{payload: this.encryptService.encrypt(user)}, {headers})
    .pipe(
      tap(res => {
        this.tokenTitular.set(res.token!)
        }
      ),
      catchError(res => of(res.error as Res))
    )
  }

  logout = (reload:boolean = false):void => {
    this.clearStorage();
    this.router.navigateByUrl('auth');
    if(reload) {
      location.reload();
    }
  }

  clearStorage = ():void => {
    this.data.set(undefined);
    localStorage.clear();
    this.webSocketService.emit('logout');
  }
}

