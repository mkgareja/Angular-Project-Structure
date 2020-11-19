import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AddressService {
  city: string = '';
  constructor() { }

  getCityName(address, isNeighborhood = false, cityList, form) {
    if (isNeighborhood) {
      address.address_components.map(x => {
        x.types.map(y => {
          if (!isNeighborhood) {
            if (y.includes('neighborhood')) {
              this.city = x.short_name;
            }
          } else {
            if (y.includes('sublocality_level_1')) {
              this.city = x.short_name;
            }
          }
        });
      });
    }
    const checkCityIndex = cityList.findIndex(c => c.CITY === this.city);
    if (checkCityIndex >= 0) {
      return cityList[checkCityIndex].id;
    } else {
      if (!isNeighborhood) {
        this.getCityName(address, true, cityList, form);
      } else {
        return '';
      }
    }
  }
}
