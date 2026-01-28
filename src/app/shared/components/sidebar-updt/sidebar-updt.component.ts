// import { Location } from '@angular/common';
// import { AfterViewInit, Component, inject, OnInit } from '@angular/core';
// import { AuthService } from '../../../auth/services/auth.service';
// import { forkJoin } from 'rxjs';
// import { VerificaService } from '../../../auth/services/verifica.service';
// import { ActualizaService } from '../../../main/services/actualiza.service';

// import Swal from 'sweetalert2';
// import { Router } from '@angular/router';
// import { CloseElementsService } from '../../services/close-elements.service';


// declare var $:any;

// @Component({
// selector: 'shared-sidebar-updt',
// templateUrl: './sidebar-updt.component.html',
// styleUrl: './sidebar-updt.component.css'
// })
// export class SidebarUPDTComponent implements OnInit, AfterViewInit {
//   private location = inject(Location);
//   private router = inject(Router);
//   private authService = inject(AuthService);
//   private verifyService = inject(VerificaService);
//   private actualizaService = inject(ActualizaService);
//   private closeElements = inject(CloseElementsService);

//   public lista_items = [
//     {
//       descripcion:'Estado de la Base de Datos',
//       modo:'distrital',
//       path:'status',
//       end_point:'data_base',
//       lista:false
//     },
//     {
//       descripcion:'Consulta de fórmulas',
//       modo:'distrital',
//       path:'reportes',
//       end_point:'consulta_formulas',
//       lista:false
//     },
//     {
//       descripcion:'Consulta de proyectos',
//       modo:'distrital',
//       path:'reportes',
//       end_point:'consulta_proyectos',
//       lista:false
//     },
//     {
//       descripcion:'Seguimiento',
//       id:'seguimiento',
//       id_secundario:'btn_seguimiento',
//       modo:'distrital',
//       path:'seguimiento',
//       lista:true,
//       items: [
//         {
//           nombre:'Mesas instaladas',
//           end_point:'mesas_instaladas'
//         },
//         {
//           nombre:'Inicio de la validación',
//           end_point:'inicio_validacion'
//         },
//         {
//           nombre:'Registro de incidencias',
//           end_point:'registro_incidentes'
//         },
//         {
//           nombre:'Captura de resultados de la Consulta por Mesa',
//           end_point:'captura_resultados'
//         },
//         {
//           nombre:'Conclusión de la validación',
//           end_point:'conclusion_validacion'
//         }
//       ]
//     },
//     {
//       descripcion:'Reportes',
//       modo:'distrital',
//       path:'reportes',
//       end_point:'reportes_generales',
//       lista:false
//     },
//     {
//       descripcion:'Procesos',
//       id:'procesos',
//       id_secundario:'btn_procesos',
//       modo:'distrital',
//       path:'procesos',
//       lista:true,
//       items: [
//         {
//           nombre:'Actualización de datos del distrito',
//           end_point:'actualizacion_datos'
//         },
//       ]
//     },
//     {
//       descripcion:'Constancias',
//       modo:'distrital',
//       path:'reportes',
//       end_point:'constancias',
//       lista:false
//     },
//     {
//       descripcion:'Reportes',
//       modo:'central',
//       path:'reportes',
//       end_point:'generar_reportes',
//       lista:false
//     },
//     {
//       descripcion:'Eliminar Actas',
//       modo:'central',
//       path:'seguimiento',
//       end_point:'elimina_acta',
//       lista:false
//     },
//     {
//       descripcion:'Usuarios Conectados',
//       modo:'admin',
//       path:'procesos',
//       end_point:'usuarios_conectados',
//       lista:false
//     },
//     {
//       descripcion:'Eliminar Proyectos',
//       modo:'admin',
//       path:'procesos',
//       end_point:'eliminar_proyectos',
//       lista:false
//     },
//     {
//       descripcion:'Importaciones SEI/Proyectos',
//       modo:'admin',
//       path:'procesos',
//       end_point:'importar_votos',
//       lista:false
//     },
//   ];

//   private lista_seleccionada:string = '';
//   private btn_seleccionado:string = '';
//   public open:boolean = false;

//   // Getters de datos para funcionamiento del menú lateral.
//   get show():boolean {return !this.location.path().match('auth') ? true : false};
//   get rol():number {return this.authService.rol!};
//   get inicioValidacion ():boolean {return localStorage.getItem('iV') == 'true' ? true : false};
//   get cierreValidacion ():boolean {return localStorage.getItem('iC') == 'true' ? true : false};
//   get opcion():number {return +localStorage.getItem('o')!};

//   ngOnInit(): void {
//   }

//   ngAfterViewInit(): void {
//     let path = this.location.path().split('/')[2];
//     if(path.match('seguimiento')) {
//       return this.openMenu('seguimiento','btn_seguimiento');
//     } else if(path.match('procesos')) {
//       return this.openMenu('procesos','btn_procesos');
//     }
//   }

//   openMenu = (id:string, id_secundario:string) => {
//     let height = 0;
//     let control = $(`#${id}`)[0];
//     let control_secundario = $(`#${id_secundario}`);
//     control_secundario.toggleClass('arrow');
//     if(control.clientHeight == 0) {
//       if(id == 'seguimiento') {
//         if(this.inicioValidacion) {
//           height = 228;
//         } else {
//           height = 80;
//         }
//       } else {
//         if(this.opcion > 0) {
//           height = 110;
//         } else {
//           height = 67;
//         }
//       }
//     }

//     control.style.height = `${height}px`;
//     if(this.lista_seleccionada !== '' && this.btn_seleccionado !== '') {
//       if(id !== this.lista_seleccionada) {
//         let control = $(`#${this.lista_seleccionada}`)[0];
//         let btn = $(`#${this.btn_seleccionado}`);
//         if(control.clientHeight > 0) {
//           btn.toggleClass('arrow');
//           control.style.height = '0px';
//         }
//       }
//     }

//     this.lista_seleccionada = id;
//     this.btn_seleccionado = id_secundario;
//   }

//   openNav = ():void => {
//     const sideNav = document.getElementById('sidenav');
//     const mainContent = document.getElementById('main');
//     this.open = !this.open;

//     if(!this.open) {
//       sideNav!.style.width = '240px';
//       mainContent!.style.paddingLeft = '240px';
//     } else {
//       sideNav!.style.width = '0px';
//       mainContent!.style.paddingLeft = '0px';
//     }
//   }

//   closeModal = ():void => {
//     this.closeElements.close();
//   }

//   cleanDB = ():void => {
//     Swal.fire({
//       icon:'info',
//       title:'¡Confirmación requerida!',
//       html:`La limpieza de la Base de Datos, <b>es un proceso que no puede ser revertido,</b> al dar clic en el boton
//       <i class="text-info">"Continuar"</i> se desplegará el formulario de confirmación.`,
//       allowEscapeKey:false,
//       allowOutsideClick:false,
//       confirmButtonText:'Continuar'
//     }).then(() => {
//       Swal.fire({
//         icon:'warning',
//         title:'¡Atención!',
//         html:'Se requiere la confirmación del texto requerido para realizar la limpieza de la Base de Datos.',
//         input:'text',
//         inputPlaceholder:'Confirmar Limpieza',
//         customClass: {input:'input-sweet'},
//         showCancelButton:true,
//         cancelButtonText:'Cancelar',
//         confirmButtonText:'Confirmar',
//         allowEscapeKey:false,
//         allowOutsideClick:false,
//       }).then((result) => {
//         if(result.isConfirmed) {
//           if(result.value === 'Confirmar Limpieza') {
//             Swal.fire({
//               icon:'success',
//               title:'¡Confirmación exitosa!',
//               html:`La confirmación de la frase se ha realizado correctamente.`,
//               showConfirmButton:false,
//               timer:2400
//             }).then(() => {
//               Swal.fire({
//                 title:'Espere un momento',
//                 text:'Se está procesando la limpieza de la Base de Datos...',
//                 allowEscapeKey:false,
//                 allowOutsideClick:false,
//                 didOpen:() => {
//                   Swal.showLoading();
//                 }
//               });

//               forkJoin({
//                 verify:this.verifyService.checkAuthentication(),
//                 res:this.actualizaService.deleteBD()
//               }).subscribe(({verify, res}) => {
//                 Swal.close();

//                 if(!verify) return;

//                 Swal.fire({
//                   icon:res.success ? 'success' : 'error',
//                   title:res.success ? '¡Correcto!' : '¡Error!',
//                   text:res.msg,
//                   showConfirmButton:false,
//                   timer:2400
//                 }).then(() => {
//                   this.authService.inicioValidacion = false;
//                   this.authService.cierreValidacion = false;
//                   this.closeElements.close();
//                   if(this.location.path().match('data_base')) {
//                     location.reload();
//                   } else {
//                     this.router.navigateByUrl('distrital');
//                     localStorage.setItem('iV','false');
//                     localStorage.setItem('iC','false');
//                   }
//                 })
//               })
//             })
//           } else {
//             Swal.fire({
//               icon:'error',
//               title:'¡Confirmación fallida!',
//               html:`La frase proporcionada: <i class="text-danger">${result.value}</i>, es incorrecta <b>¡intente de nuevo.!</b>`,
//               confirmButtonText:'Entendido'
//             })
//           }
//         }
//       })
//     })
//   }
// }

import { Location } from '@angular/common';
import { AfterViewInit, Component, computed, effect, inject, signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';
import { CloseElementsService } from '../../services/close-elements.service';
import Swal from 'sweetalert2';
import { ActualizaService } from '../../../main/services/actualiza.service';
import { forkJoin } from 'rxjs';
import { VerificaService } from '../../../auth/services/verifica.service';

interface ItemsLista {
  descripcion: string;
  id?:string;
  id_secundario?:string;
  modo: string;
  path:string;
  end_point?:string;
  lista?:boolean;
  rol?:number[];
  items?: Items[];
}

interface Items {
  nombre?:string;
  end_point?:string;
  inicioValidacion?:boolean;
}

declare var $:any;
@Component({
selector: 'shared-sidebar-updt',
templateUrl: './sidebar-updt.component.html',
styleUrl: './sidebar-updt.component.css'
})
export class SidebarUPDTComponent implements AfterViewInit {
  private router = inject(Router);
  private location = inject(Location);
  private authService = inject(AuthService);
  private closeElementsService = inject(CloseElementsService);
  private actualizaService = inject(ActualizaService);
  private verifyService = inject(VerificaService);

  listaItems:ItemsLista[] = [
    {
			descripcion: 'Estado de la Base de Datos',
			modo: 'distrital',
			path: 'status',
			end_point: 'data_base',
			lista: false,
			rol: [1, 2]
		},
		{
			descripcion: 'Consulta de Candidaturas',
			modo: 'distrital',
			path: 'reportes',
			end_point: 'consulta_candidaturas',
			lista: false,
			rol: [1, 2]
		},
		{
			descripcion: 'Consulta de proyectos',
			modo: 'distrital',
			path: 'reportes',
			end_point: 'consulta_proyectos',
			lista: false,
			rol: [1, 2]
		},
		{
			descripcion: 'Seguimiento',
			id: 'seguimiento',
			id_secundario: 'btn_seguimiento',
			modo: 'distrital',
			path: 'seguimiento',
			lista: true,
			rol: [1, 2],
			items: [
				{
					nombre: 'Mesas instaladas',
					end_point: 'mesas_instaladas',
					inicioValidacion: false
				},
				{
					nombre: 'Inicio de la validación',
					end_point: 'inicio_validacion',
					inicioValidacion: false
				},
				{
					nombre: 'Registro de incidencias',
					end_point: 'registro_incidentes',
					inicioValidacion: true
				},
				{
					nombre: 'Captura de resultados de la Consulta por Mesa',
					end_point: 'captura_resultados',
					inicioValidacion: true
				},
				{
					nombre: 'Conclusión de la validación',
					end_point: 'conclusion_validacion',
					inicioValidacion: true
				}
			]
		},
		{
			descripcion: 'Reportes',
			modo: 'distrital',
			path: 'reportes',
			end_point: 'reportes_generales',
			lista: false,
			rol: [1, 2]
		},
		{
			descripcion: 'Procesos',
			id: 'procesos',
			id_secundario: 'btn_procesos',
			modo: 'distrital',
			path: 'procesos',
			lista: true,
			rol: [1, 2],
			items: [
				{
					nombre: 'Actualización de datos del distrito',
					end_point: 'actualizacion_datos',
					inicioValidacion: false
				},
				{
					nombre: 'Limpieza de la Base de Datos',
					end_point: '',
					inicioValidacion: false
				}
			]
		},
		{
			descripcion: 'Constancias',
			modo: 'distrital',
			path: 'reportes',
			end_point: 'constancias',
			lista: false,
			rol: [1, 2]
		},
		{
			descripcion: 'Reportes',
			modo: 'central',
			path: 'reportes',
			end_point: 'generar_reportes',
			lista: false,
			rol: [3, 4]
		},
		{
			descripcion: 'Eliminar Actas',
			modo: 'central',
			path: 'seguimiento',
			end_point: 'elimina_acta',
			lista: false,
			rol: [4]
		},
		{
			descripcion: 'Usuarios Conectados',
			modo: 'admin',
			path: 'procesos',
			end_point: 'usuarios_conectados',
			lista: false,
			rol: [99]
		},
		{
			descripcion: 'Eliminar Proyectos',
			modo: 'admin',
			path: 'procesos',
			end_point: 'eliminar_proyectos',
			lista: false,
			rol: [99]
		},
		{
			descripcion: 'Importaciones SEI/Proyectos',
			modo: 'admin',
			path: 'procesos',
			end_point: 'importar_votos',
			lista: false,
			rol: [99]
		}
  ];

  private lista_seleccionada = signal<string>('');
  private btn_seleccionado = signal<string>('');
  private route  = signal<string>(this.location.path());

  public showMenu = computed(() => this.authService.token() && !this.route().match('auth'));
  public userRole = computed(() => this.authService.rol());
  public inicioValidacion = computed(() => this.authService.inicioValidacion());
  public cierreValidacion = computed(() => this.authService.cierreValidacion());
  public opcion = computed(() => this.authService.ocultaOpcion());
  public perfil = computed(() => [3,4].includes(this.userRole()!) ? 'Central' : this.userRole() == 99 ? 'Administrador' : undefined);

  constructor() {
    effect(() => {
      const id = this.lista_seleccionada();
      const inicioVal = this.inicioValidacion();
      const cierreVal = this.cierreValidacion();
      let height = 0;
      if(id == '') {
        return;
      }

      if(id.match('seguimiento')) {
        height =  inicioVal ? 230 : 80;
      } else {
        height = this.opcion()! > 0 ? 110 : 68;
      }
      let control = $(`#${id}`)[0];
      control.style.height = `${height}px`;
    });
    this.router.events.subscribe(event => {
      if(event instanceof NavigationEnd) {
        this.route.set(this.location.path());
      }
    })
  }

  ngAfterViewInit():void {
		let path = this.location.path().split('/')[2];
    setTimeout(() => {
      if (path.match('seguimiento')) {
        return this.openMenu('seguimiento', 'btn_seguimiento');
      } else if (path.match('procesos')) {
        return this.openMenu('procesos', 'btn_procesos');
      }
    }, 400);
  }

  openMenu = (id:string, id_secundario:string):void => {
    let height = 0;
    let control = $(`#${id}`)[0];
    let control_secundario = $(`#${id_secundario}`);
    control_secundario.toggleClass('arrow');
    if(this.userRole()! < 3) {
      if(control.clientHeight == 0) {
        if(id.match('seguimiento')) {
          height = this.inicioValidacion() ? 228 : 80;
        } else {
          height = this.opcion()! > 0 ? 110 : 68;
        }
      }
      control.style.height = `${height}px`;
      if(this.lista_seleccionada() !== '' && this.btn_seleccionado() !== '') {
        if(id !== this.lista_seleccionada()) {
          let control = $(`#${this.lista_seleccionada()}`)[0];
          let btn = $(`#${this.btn_seleccionado()}`);
          if(control.clientHeight > 0) {
            btn.toggleClass('arrow');
            control.style.height = '0px';
          }
        }
      }
      this.lista_seleccionada.set(id);
      this.btn_seleccionado.set(id_secundario);
    }
  }

  closeMenu = ():void => this.closeElementsService.close();

  cleanDB = ():void => {
    Swal.fire({
      icon:'info',
      title:'¡Confirmación requerida!',
      html:`La limpieza de la Base de Datos, <b>es un proceso que no puede ser revertido,</b> al dar clic en el botón
      <i class="text-info">"Continuar"</i> se desplegará el formulario de confirmación del texto requerido.`,
      allowEscapeKey:false,
      allowOutsideClick:false,
      confirmButtonText:'Continuar'
    }).then(() => {
      Swal.fire({
        icon:'warning',
        title:'¡Atención!',
        html:'Se requiere la confirmación del texto requerido en pantalla para realizar la limpieza de la Base de Datos.',
        input:'text',
        inputPlaceholder:'Confirmar Limpieza',
        customClass: {input:'input-sweet'},
        showCancelButton:true,
        cancelButtonText:'Cancelar',
        confirmButtonText:'Confirmar',
        allowEscapeKey:false,
        allowOutsideClick:false,
      }).then((result) => {
        if(result.isConfirmed) {
          if(result.value === 'Confirmar Limpieza') {
            Swal.fire({
              icon:'success',
              title:'¡Confirmación exitosa!',
              html:`La confirmación de la frase se ha realizado correctamente.`,
              showConfirmButton:false,
              timer:2400
            }).then(() => {
              Swal.fire({
                title:'Espere un momento',
                text:'Se está procesando la limpieza de la Base de Datos...',
                allowEscapeKey:false,
                allowOutsideClick:false,
                didOpen:() => {
                  Swal.showLoading();
                }
              });

              forkJoin({
                verify:this.verifyService.checkAuthentication(),
                res:this.actualizaService.deleteBD()
              }).subscribe(({verify, res}) => {
                Swal.close();
                if(!verify) return;
                Swal.fire({
                  icon:res.success ? 'success' : 'error',
                  title:res.success ? '¡Correcto!' : '¡Error!',
                  text:res.msg,
                  showConfirmButton:false,
                  timer:2400
                }).then(() => {
                  if(this.location.path().match('data_base')) {
                    location.reload();
                  } else {
                    this.closeElementsService.close();
                    this.router.navigateByUrl('distrital');
                  }
                  $('#procesos')[0].style.height = '0px';
                })
              })
            })
          } else {
            Swal.fire({
              icon:'error',
              title:'¡Confirmación fallida!',
              html:`La frase proporcionada: <i class="text-danger">${result.value}</i>, es incorrecta <b>¡intente de nuevo!</b>`,
              confirmButtonText:'Entendido'
            })
          }
        }
      })
    })
  }
}
