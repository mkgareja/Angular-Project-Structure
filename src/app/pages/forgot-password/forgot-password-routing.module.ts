// external
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// internal
import { ForgotPasswordComponent } from './forgot-password.component';

const routes: Routes = [{ path: '', component: ForgotPasswordComponent }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ForgotPasswordRoutingModule { }