// external
import { NgModule } from '@angular/core';

// internal
import { SharedModule } from '@shared/shared.module';

import { ForgotPasswordComponent } from './forgot-password.component';
import { ForgotPasswordRoutingModule } from './forgot-password-routing.module';

@NgModule({
  declarations: [ForgotPasswordComponent],
  imports: [ForgotPasswordRoutingModule, SharedModule],
})
export class ForgotPasswordModule {}
