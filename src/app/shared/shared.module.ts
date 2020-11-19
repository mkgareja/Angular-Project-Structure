// external
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTrimModule } from 'ng2-trim-directive';

// internal
import { ValidationMessageComponent } from './components/validation-message/validation-message.component';
import { ReviewComponent } from './components/review/review.component';
import { AutocompleteComponent } from './components/autocomplete/autocomplete.component';
import { GooglePlaceModule } from "ngx-google-places-autocomplete";
import { RatingModule } from 'ng-starrating';
import { NgxPaginationModule } from 'ngx-pagination';
@NgModule({
  declarations: [ValidationMessageComponent, ReviewComponent, AutocompleteComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    InputTrimModule,
    GooglePlaceModule,
    RatingModule,
    NgxPaginationModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    InputTrimModule,
    ValidationMessageComponent,
    ReviewComponent,
    AutocompleteComponent,
    GooglePlaceModule
  ],
})
export class SharedModule { }
