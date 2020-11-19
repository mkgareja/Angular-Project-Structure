// external
import { NgModule } from '@angular/core';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';

// internal
import { SharedModule } from '@shared/shared.module';

import { SetTimeComponent } from './set-time.component';
import { SetTimeRoutingModule } from './set-time-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UiSwitchModule } from 'ngx-toggle-switch';

@NgModule({
  declarations: [SetTimeComponent],
  imports: [
    NgxMaterialTimepickerModule.setLocale('en-US'),
    SetTimeRoutingModule,
    SharedModule,
    NgbModule,
    UiSwitchModule
  ],
})
export class SetTimeModule { }
