import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PublicGuard } from './auth/guards/public.guard';
import { AuthGuard } from './auth/guards/auth.guard';
import { generalGuard } from './auth/guards/is-distrital.guard';


const routes: Routes = [
  {
    path:'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule),
    canActivate:[PublicGuard]
  },
  {
    path:'distrital',
    loadChildren: () => import('./main/distrital.module').then(m => m.MainModule),
    canActivate:[AuthGuard, generalGuard]
  },
  {
    path:'central',
    loadChildren: () => import('./deoeyg/deoeyg.module').then(m => m.DeoeygModule),
    canActivate:[AuthGuard, generalGuard]
  },
  {
    path:'admin',
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule),
    canActivate:[AuthGuard, generalGuard]
  },
  {
    path:'**',
    redirectTo:'auth'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
