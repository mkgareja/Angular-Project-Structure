import { Injectable } from '@angular/core';

@Injectable()
// eslint-disable-next-line import/prefer-default-export
export class LogService {
  /**
   * log() => print console log only in debug mode
   */
  static log(...args: any[]) {
    // eslint-disable-next-line no-console
    console.log(args.join(' '));
  }
}
