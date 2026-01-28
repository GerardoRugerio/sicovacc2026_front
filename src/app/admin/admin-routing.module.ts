import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminPageComponent } from './pages/admin-page/admin-page.component';
import { DeleteProjectsComponent } from './components/delete-projects/delete-projects.component';
import { ImportVotosComponent } from './components/import-votos/import-votos.component';
import { ConnectedUsersComponent } from './components/connected-users/connected-users.component';

const routes: Routes = [
  {
    path:'procesos',
    component: AdminPageComponent,
    children: [
      {
        path:'usuarios_conectados',
        component:ConnectedUsersComponent
      },
      {
        path:'eliminar_proyectos',
        component:DeleteProjectsComponent
      },
      {
        path:'importar_votos',
        component:ImportVotosComponent
      },
      {
        path:'**',
        redirectTo:'usuarios_conectados'
      }
    ]
  },
  {
    path:'**',
    redirectTo:'procesos'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
