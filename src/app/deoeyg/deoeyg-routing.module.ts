import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DeoeygMainPageComponent } from './pages/deoeyg-main-page/deoeyg-main-page.component';
import { MainPageComponent } from '../main/pages/main-page/main-page.component';
import { ReportesComponent } from './components/reportes/reportes.component';
import { ListaActasComponent } from './components/lista-actas/lista-actas.component';
import { isAdminCentralGuard } from '../auth/guards/is-admin-central.guard';

const routes: Routes = [
  {
    path:'main',
    component:DeoeygMainPageComponent,
    children: [
      {
        path:'index',
        component: MainPageComponent
      },
      {
        path:'**',
        redirectTo:'index'
      }
    ]
  },
  {
    path:'reportes',
    component:DeoeygMainPageComponent,
    children: [
      {
        path:'generar_reportes',
        component:ReportesComponent
      },
      {
        path: '**',
        redirectTo:'generar_reportes'
      }
    ]
  },
  {
    path:'seguimiento',
    component:DeoeygMainPageComponent,
    children: [
      {
        path:'elimina_acta',
        canActivate:[isAdminCentralGuard],
        component:ListaActasComponent
      },
      {
        path:'**',
        redirectTo:'seguimiento'
      }
    ]
  },
  {
    path:'**',
    redirectTo:'main'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DeoeygRoutingModule { }
