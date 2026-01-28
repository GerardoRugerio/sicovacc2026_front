import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainRoutingModule } from './distrital-routing.module';
import { SharedModule } from '../shared/shared.module';

import { LayoutPageComponent } from './pages/layout-page/layout-page.component';
import { MainPageComponent } from './pages/main-page/main-page.component';
import { ConsultPageComponent } from './pages/consult-page/consult-page.component';
import { CapturaActasMesaPageComponent } from './pages/captura-actas-mesa-page/captura-actas-mesa-page.component';
import { RegistIncidentesPageComponent } from './pages/regist-incidentes-page/regist-incidentes-page.component';
import { BuscadoresComponent } from './components/buscadores/buscadores.component';
import { DescripcionComponent } from './components/descripcion/descripcion.component';
import { SaveIncidenciasComponent } from './components/save-incidencias/save-incidencias.component';
import { MesasInstaladasComponent } from './components/mesas-instaladas/mesas-instaladas.component';
import { DataTablesModule } from 'angular-datatables';
import { ReportesGeneralesPageComponent } from './pages/reportes-generales-page/reportes-generales-page.component';
import { ConfirmaAccionComponent } from './components/confirma-accion/confirma-accion.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ActualizadatosPageComponent } from './pages/actualizadatos-page/actualizadatos-page.component';
import { BDStatusPageComponent } from './pages/bdstatus-page/bdstatus-page.component';
import { ComputoPageComponent } from './pages/computo-page/computo-page.component';
import { CapturaActasComponent } from './components/captura-actas/captura-actas.component';
import { ActasPageComponent } from './pages/actas-page/actas-page.component';
import { FormulasComponent } from './components/formulas/formulas.component';
import { FormulasPageComponent } from './pages/formulas-page/formulas-page.component';


@NgModule({
  declarations: [
    LayoutPageComponent,
    MainPageComponent,
    ConsultPageComponent,
    CapturaActasMesaPageComponent,
    RegistIncidentesPageComponent,
    BuscadoresComponent,
    DescripcionComponent,
    SaveIncidenciasComponent,
    MesasInstaladasComponent,
    ReportesGeneralesPageComponent,
    ConfirmaAccionComponent,
    ActualizadatosPageComponent,
    BDStatusPageComponent,
    ComputoPageComponent,
    CapturaActasComponent,
    ActasPageComponent,
    FormulasComponent,
    FormulasPageComponent,
  ],
  imports: [
    CommonModule,
    MainRoutingModule,
    SharedModule,
    DataTablesModule,
    ReactiveFormsModule
  ],
  exports: [
    BuscadoresComponent
  ]
})
export class MainModule { }
