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
    path: 'sale-detail/:id',
    loadComponent: () =>
      import('../components/sale-detail.component').then((m) => m.SaleDetailComponent),
    canActivate: [AuthGuard],
  },
   {
    path: 'add-sale',
    loadComponent: () =>
      import('../components/add-sales-form.component').then((m) => m.AddSalesFormComponent),
    canActivate: [AuthGuard],
  },
   {
    path: 'edit-sale/:id',
    loadComponent: () =>
      import('../components/edit-sales-form.component').then((m) => m.EditSaleComponent),
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
