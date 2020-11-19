import { Component, OnInit, Output, EventEmitter, ViewChild, AfterViewInit, Input } from '@angular/core';

@Component({
  selector: 'app-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss']
})
export class AutocompleteComponent implements OnInit, AfterViewInit {
  @Output() setAddress: EventEmitter<any> = new EventEmitter();
  @ViewChild('addresstext') addresstext: any;
  autocompleteInput: string;
  queryWait: boolean;

  constructor() { }

  ngOnInit(): void {
    this.getPlaceAutocomplete();
  }

  ngAfterViewInit() {
    //this.getPlaceAutocomplete();
  }

  getPlaceAutocomplete() {
    const autocomplete = new google.maps.places.Autocomplete(this.addresstext.nativeElement,
      // {
      //   componentRestrictions: { country: 'US' },
      //   // types: [this.adressType]  // 'establishment' / 'address' / 'geocode'
      // }
    );
    google.maps.event.addListener(autocomplete, 'place_changed', () => {
      const place = autocomplete.getPlace();
      this.invokeEvent(place);
    });
  }

  invokeEvent(place: Object) {
    this.setAddress.emit(place);
  }
}
