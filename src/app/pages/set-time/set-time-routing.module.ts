// external
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// internal
import { SetTimeComponent } from './set-time.component';

const routes: Routes = [{ path: '', component: SetTimeComponent }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SetTimeRoutingModule { }