import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UniquePipe } from './unique.pipe';
import { DatePipe } from './date.pipe';

@NgModule({
  declarations: [UniquePipe, DatePipe ],
  imports: [CommonModule],
  exports: [UniquePipe, DatePipe ],
  providers: [DatePipe]
})

export class MainPipe { }
