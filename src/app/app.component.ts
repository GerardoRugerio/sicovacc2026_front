import { Component, inject, OnInit } from '@angular/core';
import { WebsocketService } from './shared/services/websocket.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  private webSocketService = inject(WebsocketService);
  private router = inject(Router);

  ngOnInit(): void {
    this.webSocketService.listen('usuario-activo')
    .subscribe(res => {
      Swal.fire({
        icon: 'warning',
        title: '¡Sesión duplicada!',
        text: res as string,
        allowOutsideClick: false,
        allowEscapeKey: false,
        animation: true,
        confirmButtonText: 'Entendido'
      }).then(() => {
        localStorage.clear();
        this.router.navigateByUrl('auth');
      })
    })
  }
}
