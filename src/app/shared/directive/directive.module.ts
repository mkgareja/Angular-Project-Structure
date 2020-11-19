import { DebounceKeyupDirective } from './debounce-keyup.directive';
import { NgModule } from '@angular/core';
import { OnlyNumbersDirective } from './number-only.directive';

@NgModule({
  declarations: [
    OnlyNumbersDirective,
    DebounceKeyupDirective,
  ],
  exports: [
    OnlyNumbersDirective,
    DebounceKeyupDirective,
  ]
})
export class DirectiveModule { }
