// external
import { NgModule } from '@angular/core';

// internal
import { SharedModule } from '@shared/shared.module';

import { LoginComponent } from './login.component';
import { LoginRoutingModule } from './login-routing.module';

@NgModule({
  declarations: [LoginComponent],
  imports: [LoginRoutingModule, SharedModule],
})
export class LoginModule {}
