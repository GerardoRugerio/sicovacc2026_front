import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidatorsService } from '../../../shared/services/validators.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';
import { User } from '../../interfaces/user.interface';
import { WebsocketService } from '../../../shared/services/websocket.service';


@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent {
  private fb = inject(FormBuilder);
  private validatorsService = inject(ValidatorsService);
  private router = inject(Router);
  private authService = inject(AuthService);

  public loginForm:FormGroup = this.fb.group({
    usuario:['', [Validators.required ,Validators.minLength(4), Validators.maxLength(15)]],
    contrasena:['',[Validators.required]]
  })

  private rol = computed(() => this.authService.rol());

  public loading = signal<boolean>(false);

  login = ():void => {
    if(this.loading()) {
      return;
    }

    if(this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      Swal.fire({
        icon:'warning',
        title:'¡Atención!',
        text:'Todos los campos marcados como obligatorios deben contener la información requerida',
        confirmButtonText:'Entendido'
      });
      return;
    }

    this.loading.set(true);
    this.authService.login(this.loginForm.value as User)
    .subscribe(res => {
      Swal.fire({
        icon:res.success ? 'success' : 'error',
        title:res.success ? '¡Correcto!' : '¡Error!',
        text: res.msg == undefined ? '¡No hay conexión con el servidor!' : res.msg,
        showConfirmButton:false,
        timer:2000
      }).then(() => {
        if(res.success) {
          this.loginForm.reset();
          this.loading.set(false);
          switch(this.rol()) {
            case 1:
              this.router.navigate(['distrital']);
            break;
            case 2:
              this.router.navigate(['distrital']);
            break;
            case 3:
              this.router.navigate(['central/reportes/generar_reportes']);
            break;
            case 4:
              this.router.navigate(['central']);
            break;
            case 99:
              this.router.navigate(['admin']);
            break;
          }
        }
      })
    })
  }

  //funciones de validación del formulario de inicio de sesión.
  isValidField = (field:string):boolean =>this.validatorsService.isValidField(this.loginForm, field)!;
  getFieldErrors = (field:string):string => this.validatorsService.getFieldError(this.loginForm, field);
}
