import { inject, Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private socket = inject(Socket);

  socketStatus:boolean = false;
  constructor() {
    this.checkStatus();
  }

  checkStatus = () => {
    this.socket.on('connect', () => {
      console.table('Se ha conectado con el servidor correctamente.');
      if(localStorage.getItem('id_transaccion')) {
        this.socket.emit('configurar-usuario', { id_transaccion: Number.parseInt(localStorage.getItem('id_transaccion')!) });
      }
      this.socketStatus = true;
    })

    this.socket.on('disconnect', () => {
      console.table('Se ha perdido la conexión con el servidor.');
      this.socketStatus = false;
    })
  }

  listen = (evento:string) => this.socket.fromEvent(evento);

  emit = (evento:string, payLoad?:any, callback?:Function) => this.socket.emit(evento,payLoad,callback);
}
