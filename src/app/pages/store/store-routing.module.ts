import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StoreComponent } from './store.component';
import { ProductComponent } from './product/product.component';
import { ProductAddComponent } from './product-add/product-add.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { StoreEditDetailsComponent } from './store-edit-detail/store-edit-detail.component';
import { ProductResolverService } from './product-resolver.service';
import { ReviewComponent } from '@shared/components/review/review.component';
import { BatchUploadComponent } from './batch-upload/batch-upload.component';
import { AuthGuard } from '@services/auth-guard.service';

const routes: Routes = [
  { path: 'profile', component: StoreComponent },
  {
    path: 'products',
    component: ProductComponent,
    resolve: { product: ProductResolverService },
    canActivate: [AuthGuard]
  },
  { path: 'products/add-edit', component: ProductAddComponent, canActivate: [AuthGuard] },
  { path: 'products/:id/detail', component: ProductDetailComponent, canActivate: [AuthGuard] },
  { path: 'change-password', component: ChangePasswordComponent, canActivate: [AuthGuard] },
  { path: 'detail/:id', component: StoreEditDetailsComponent, canActivate: [AuthGuard] },
  { path: 'product/review', component: ReviewComponent, canActivate: [AuthGuard] },
  { path: 'batch-upload', component: BatchUploadComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StoreRoutingModule { }
