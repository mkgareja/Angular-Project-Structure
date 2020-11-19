// external
import { NgModule } from '@angular/core';
import { AgmCoreModule } from '@agm/core';

// internal
import { SharedModule } from '@shared/shared.module';

import { SignUpComponent } from './sign-up.component';
import { SignUpRoutingModule } from './sign-up-routing.module';
import { environment } from 'src/environments/environment';
import { Constants } from '@constant/constants';

@NgModule({
  declarations: [SignUpComponent],
  imports: [
    SignUpRoutingModule,
    SharedModule,
    AgmCoreModule.forRoot({
      apiKey: environment.MAP_KEY,
      libraries: [Constants.MAP_LIBRARIES],
    }),
  ],
})
export class SignUpModule {}
