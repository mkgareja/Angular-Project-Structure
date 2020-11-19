// external
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { LayoutModule } from 'angular-admin-lte';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { NgxSpinnerModule } from 'ngx-spinner';
import { DndModule } from 'ng2-dnd';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { JwtModule } from '@auth0/angular-jwt';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import {
  TranslateModule,
  TranslateLoader,
  TranslateService,
} from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { InputTrimModule } from 'ng2-trim-directive';
import { BsModalRef, ModalModule } from 'ngx-bootstrap/modal';

// internal
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { adminLteConf } from './admin-lte.conf';

import { ApiService } from '@services/api.service';
import { FormService } from '@services/form.service';
import { NotFoundComponent } from '@pages/not-found/not-found.component';
import { HeaderComponent } from './shared/components/header/header.component';
import { SideBarComponent } from './shared/components/side-bar/side-bar.component';
import { RatingModule } from 'ng-starrating';
import { NgxPaginationModule } from 'ngx-pagination';

export function getToken() {
  return localStorage.getItem('token');
}

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, '../assets/i18n/', '.json');
}
@NgModule({
  declarations: [AppComponent, NotFoundComponent, HeaderComponent, SideBarComponent],
  imports: [
    BrowserModule,
    MatDatepickerModule,
    MatTabsModule,
    SlickCarouselModule,
    MatNativeDateModule,
    NgxMaterialTimepickerModule,
    NgxMaterialTimepickerModule.setLocale('en-GB'),
    DndModule.forRoot(),
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    NgxSpinnerModule,
    InputTrimModule,
    LayoutModule.forRoot(adminLteConf),
    MatExpansionModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: getToken,
      },
    }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
    }),
    ModalModule.forRoot(),
    RatingModule,
    NgxPaginationModule
  ],
  exports: [
    MatDatepickerModule,
    MatTabsModule,
    SlickCarouselModule,
    NgxMaterialTimepickerModule,
    MatNativeDateModule,
    MatInputModule,
    TranslateModule,
    MatExpansionModule
  ],
  providers: [ApiService, FormService, BsModalRef],
  bootstrap: [AppComponent],
})
export class AppModule { }
