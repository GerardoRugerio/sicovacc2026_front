import { computed, inject, Injectable, signal } from '@angular/core';
import { environments } from '../../../environments/environments';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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

