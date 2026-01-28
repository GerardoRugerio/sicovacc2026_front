import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutPageComponent } from './pages/layout-page/layout-page.component';
import { ConsultPageComponent } from './pages/consult-page/consult-page.component';
import { RegistIncidentesPageComponent } from './pages/regist-incidentes-page/regist-incidentes-page.component';
import { CapturaActasMesaPageComponent } from './pages/captura-actas-mesa-page/captura-actas-mesa-page.component';
import { ReportesGeneralesPageComponent } from './pages/reportes-generales-page/reportes-generales-page.component';
import { ActualizadatosPageComponent } from './pages/actualizadatos-page/actualizadatos-page.component';
import { BDStatusPageComponent } from './pages/bdstatus-page/bdstatus-page.component';
import { isTitularGuard } from '../auth/guards/is-titular.guard';
import { checkInicioComputoGuard } from '../auth/guards/check-inicio-computo.guard';
import { MesasInstaladasComponent } from './components/mesas-instaladas/mesas-instaladas.component';
import { ResultadosActasComponent } from '../shared/components/resultados-actas/resultados-actas.component';
import { checkCierreComputoGuard } from '../auth/guards/check-cierre-computo.guard';
import { checkVerifyGuard } from '../auth/guards/check-verify.guard';
import { ComputoPageComponent } from './pages/computo-page/computo-page.component';
import { ActasPageComponent } from './pages/actas-page/actas-page.component';
import { CapturaActasComponent } from './components/captura-actas/captura-actas.component';
import { FormulasPageComponent } from './pages/formulas-page/formulas-page.component';

const routes: Routes = [
  {
    path:'status',
    pathMatch:'full',
    component:LayoutPageComponent,
    children: [
      {
        path:'data_base',
        component:BDStatusPageComponent
      },
      {
        path:'**',
        redirectTo:'data_base'
      }
    ],
  },
  {
    path:'seguimiento',
    component:LayoutPageComponent,
    canActivate:[checkCierreComputoGuard],
    children:[
      {
        path:'mesas_instaladas',
        component: MesasInstaladasComponent,
        canActivate:[checkVerifyGuard]
      },
      {
        path:'inicio_validacion',
        component:ComputoPageComponent,
        canActivate:[checkVerifyGuard]
      },
      {
        path:'registro_incidentes',
        component:RegistIncidentesPageComponent,
        canActivate:[checkVerifyGuard,checkInicioComputoGuard]
      },
      {
        path:'captura_resultados',
        component:CapturaActasMesaPageComponent,
        canActivate:[checkVerifyGuard,checkInicioComputoGuard],
      },
      {
        path:'conclusion_validacion',
        component:ComputoPageComponent,
        canActivate:[checkVerifyGuard,checkInicioComputoGuard]
      },
      {
        path:'**',
        redirectTo:'seguimiento'
      }
    ],
  },
  {
    path:'reportes',
    component:LayoutPageComponent,
    children: [
      {
        path:'consulta_proyectos',
        component:ConsultPageComponent,
        canActivate:[checkVerifyGuard]
      },
      {
        path:'consulta_candidaturas',
        component:FormulasPageComponent,
        canActivate:[checkVerifyGuard]
      },
      {
        path:'reportes_generales',
        component:ReportesGeneralesPageComponent,
        canActivate:[checkVerifyGuard]
      },
      {
        path:'constancias',
        component:ResultadosActasComponent,
        canActivate:[checkVerifyGuard]
      },
      {
        path:'**',
        redirectTo:'constancias'
      },
    ],
  },
  {
    path:'procesos',
    component: LayoutPageComponent,
    children: [
      {
        path:'actualizacion_datos',
        component:ActualizadatosPageComponent,
        canActivate:[checkVerifyGuard]
      },
      {
        path:'**',
        redirectTo:'actualizacion_datos'
      }
    ],
  },
  {
    path:'status',
    component: LayoutPageComponent,
    children: [
      {
        path:'data_base',
        component: BDStatusPageComponent,
        canActivate:[checkVerifyGuard]
      },
      {
        path:'**',
        redirectTo:'data_base'
      }
    ]
  },
  {
    path:'**',
    redirectTo:'status'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
