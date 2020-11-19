import { Directive, EventEmitter, Output, HostListener, OnInit, OnDestroy } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Directive({
  selector: '[appDebounceKeyup]'
})
export class DebounceKeyupDirective implements OnInit, OnDestroy {
  @Output() debounceClick = new EventEmitter();
  private strokes = new Subject();
  private subscription: Subscription;

  constructor() { }

  ngOnInit() {
    this.subscription = this.strokes
      .pipe(debounceTime(200))
      .subscribe(e => this.debounceClick.emit(e));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  @HostListener('window:keyup', ['$event'])
  keyupEvent(event) {
    if (event.target.attributes.appdebouncekeyup) {
      event.preventDefault();
      event.stopPropagation();
      this.strokes.next(event);
    }
  }
}
