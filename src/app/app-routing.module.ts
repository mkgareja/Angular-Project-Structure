import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotFoundComponent } from '@pages/not-found/not-found.component';
import { AuthGuard } from '@services/auth-guard.service';

const routes: Routes = [
  {
    path: 'admin/home',
    loadChildren: () => import('./pages/dashboard/dashboard.module').then(m => m.DashboardModule)
  }, {
    path: 'store',
    loadChildren: () =>
      import('./pages/store/store.module').then((a) => a.StoreModule),
    canActivate: [AuthGuard],
  },
  {
    path: '',
    loadChildren: () =>
      import('./pages/login/login.module').then((m) => m.LoginModule),
    data: {
      customLayout: true,
    },
  },
  {
    path: 'forgot-password',
    loadChildren: () =>
      import('./pages/forgot-password/forgot-password.module').then(
        (m) => m.ForgotPasswordModule,
      ),
    data: {
      customLayout: true,
    },
  },
  {
    path: 'reset-password/:emailId',
    loadChildren: () =>
      import('./pages/reset-password/reset-password.module').then(
        (m) => m.ResetPasswordModule,
      ),
    data: {
      customLayout: true,
    },
  },
  {
    path: 'sign-up',
    loadChildren: () =>
      import('./pages/sign-up/sign-up.module').then((m) => m.SignUpModule),
    data: {
      customLayout: true,
    },
  },
  {
    path: 'set-time/:storeId',
    loadChildren: () =>
      import('./pages/set-time/set-time.module').then((m) => m.SetTimeModule),
    data: {
      customLayout: true,
    },
  },
  {
    path: '**',
    component: NotFoundComponent,
    data: {
      customLayout: true,
    },
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
