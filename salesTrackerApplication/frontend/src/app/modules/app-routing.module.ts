import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { AuthGuard } from '../services/auth.guard';
import { LoginComp } from '../components/login.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: '',
    loadChildren: () => import('./auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'home',
    loadComponent: () =>
      import('../components/dashboard.component').then((m) => m.DashboardComp),
    canActivate: [AuthGuard],
  },
  {
    path: '**',
    component: LoginComp,
  },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
