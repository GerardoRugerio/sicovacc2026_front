import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DeoeygRoutingModule } from './deoeyg-routing.module';
import { ReactiveFormsModule } from '@angular/forms';

import { DeoeygMainPageComponent } from './pages/deoeyg-main-page/deoeyg-main-page.component';
import { ListaActasComponent } from './components/lista-actas/lista-actas.component';
import { SharedModule } from '../shared/shared.module';
import { ReportesComponent } from './components/reportes/reportes.component';
import { ActasTableComponent } from './components/actas-table/actas-table.component';
import { MainModule } from '../main/distrital.module';
import { DataTablesModule } from "angular-datatables";


@NgModule({
  declarations: [
    DeoeygMainPageComponent,
    ListaActasComponent,
    ReportesComponent,
    ActasTableComponent
  ],
  imports: [
    CommonModule,
    DeoeygRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    MainModule,
    DataTablesModule
]
})
export class DeoeygModule { }
