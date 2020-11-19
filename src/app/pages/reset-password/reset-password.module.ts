// external
import { NgModule } from '@angular/core';

// internal
import { SharedModule } from '@shared/shared.module';

import { ResetPasswordComponent } from './reset-password.component';
import { ResetPasswordRoutingModule } from './reset-password-routing.module';

@NgModule({
  declarations: [ResetPasswordComponent],
  imports: [ResetPasswordRoutingModule, SharedModule],
})
export class ResetPasswordModule {}
