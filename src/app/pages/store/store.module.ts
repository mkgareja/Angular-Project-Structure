// external
import { NgModule } from '@angular/core';
import { DataTableModule } from '@pascalhonegger/ng-datatable';
import { UiSwitchModule } from 'ngx-toggle-switch';
import { BsModalRef, ModalModule } from 'ngx-bootstrap/modal';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

// internal
import { SharedModule } from '@shared/shared.module';
import { UtilityService } from '@services/utility.service';
import { StoreComponent } from './store.component';
import { StoreRoutingModule } from './store-routing.module';
import { ProductComponent } from './product/product.component';
import { ProductAddComponent } from './product-add/product-add.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { StoreEditDetailsComponent } from './store-edit-detail/store-edit-detail.component';
import { ProductResolverService } from './product-resolver.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BatchUploadComponent } from './batch-upload/batch-upload.component';
import { DirectiveModule } from '@shared/directive/directive.module';

@NgModule({
  declarations: [
    StoreComponent,
    ProductComponent,
    ProductAddComponent,
    ProductDetailComponent,
    ChangePasswordComponent,
    StoreEditDetailsComponent,
    BatchUploadComponent,
  ],
  imports: [
    NgxMaterialTimepickerModule.setLocale('en-US'),
    StoreRoutingModule,
    SharedModule,
    DataTableModule,
    UiSwitchModule,
    NgbModule,
    DirectiveModule,
    NgxDatatableModule,
    ModalModule.forRoot(),
    //  IgxTimePickerModule
  ],
  providers: [UtilityService, BsModalRef, ProductResolverService],
})
export class StoreModule {
  constructor() { }
}
