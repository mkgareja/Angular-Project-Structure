import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
import * as momentT from 'moment-timezone';
@Pipe({
  name: 'Convertdate'
})
export class DatePipe implements PipeTransform {

  transform(value: Date,  formate?: string): any {
    const date = momentT.utc(value).tz('Europe/London').format((formate ? formate : 'DD/MM/YYYY  hh:mm A'));
    return date;
  }

}
