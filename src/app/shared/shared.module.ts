import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SideMenuComponent } from './components/sidebar-updt/side-menu.component';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { ScrollTopComponent } from './components/scroll-top/scroll-top.component';
import { DataTablesModule } from 'angular-datatables';
import { FechaPipe } from './pipes/fecha.pipe';
import { ResultadosActasComponent } from './components/resultados-actas/resultados-actas.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ConfirmEliminaComponent } from './components/confirm-elimina/confirm-elimina.component';
import { LogoutButtonComponent } from './components/logout-button/logout-button.component';
import { TextPipe } from './pipes/text.pipe';
import { ConnectStatusComponent } from './components/connect-status/connect-status.component';
import { WarningsComponent } from './components/warnings/warnings.component';
import { SelectorComponent } from './components/selector/selector.component';
import { HoraPipe } from './pipes/hora.pipe';

@NgModule({
  declarations: [
    SideMenuComponent,
    HeaderComponent,
    ScrollTopComponent,
    FechaPipe,
    ResultadosActasComponent,
    ConfirmEliminaComponent,
    LogoutButtonComponent,
    TextPipe,
    ConnectStatusComponent,
    WarningsComponent,
    SelectorComponent,
    HoraPipe
  ],
  imports: [
    CommonModule,
    RouterModule,
    DataTablesModule,
    ReactiveFormsModule,
  ],
  exports: [
    SideMenuComponent,
    HeaderComponent,
    ScrollTopComponent,
    FechaPipe,
    TextPipe,
    HoraPipe,
    ResultadosActasComponent,
    ConfirmEliminaComponent,
    LogoutButtonComponent,
    ConnectStatusComponent,
    WarningsComponent,
    SelectorComponent
  ]
})
export class SharedModule { }
