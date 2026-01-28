import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminPageComponent } from './pages/admin-page/admin-page.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DeleteProjectsComponent } from './components/delete-projects/delete-projects.component';
import { SharedModule } from '../shared/shared.module';
import { DataTablesModule } from 'angular-datatables';
import { ProjectsTableComponent } from './components/projects-table/projects-table.component';
import { ImportVotosComponent } from './components/import-votos/import-votos.component';
import { MainModule } from '../main/distrital.module';
import { ConnectedUsersComponent } from './components/connected-users/connected-users.component';


@NgModule({
  declarations: [
    AdminPageComponent,
    DeleteProjectsComponent,
    ProjectsTableComponent,
    ImportVotosComponent,
    ConnectedUsersComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    DataTablesModule,
    MainModule
  ]
})
export class AdminModule { }
