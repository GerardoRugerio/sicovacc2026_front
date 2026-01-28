import { Component, inject } from '@angular/core';
import { WebsocketService } from '../../services/websocket.service';

@Component({
  selector: 'shared-connect-status',
  template: `
    <div class="message">
    <span [class]="{'text-danger': !webSocketService.socketStatus, 'text-success': webSocketService.socketStatus}">
      <strong>
        @if(webSocketService.socketStatus!){
          Conexión establecida.
        }@else{
          No hay conexión.
        }
      </strong>
    </span>
  </div>
  `,
  styles: `
  .message {
    background-color:  rgba(238, 238, 238, .7);
    backdrop-filter: blur(10px);
    border-radius: 10px;
    padding: 4px;
    position: fixed !important;
    bottom: 3px;
    left: 2px;
    z-index: 1100;
  }
  `
})
export class ConnectStatusComponent {
  public webSocketService = inject(WebsocketService);
}
