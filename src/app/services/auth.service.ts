import { ApiService } from './api.service';
import { API } from '@routes/api-routes';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  getUserAuthenticate: any;

  constructor(private apiService: ApiService) { }

  login(params) {
    return this.apiService.post(`${API.LOGIN_ROUTES.login}`, params, false);
  }

  forgotPassword(params) {
    return this.apiService.post(
      `${API.FORGOT_PASSWORD_ROUTES.forgotPassword}`,
      params,
      false,
    );
  }

  resetPassword(params) {
    return this.apiService.post(
      `${API.RESET_PASSWORD_ROUTES.resetPassword}`,
      params,
      false,
    );
  }

  signUp(params) {
    return this.apiService.post(`${API.SIGN_UP_ROUTES.signUp}`, params, false);
  }

  setTime(params) {
    return this.apiService.post(
      `${API.SET_TIME_ROUTES.setTime}`,
      params,
      false,
    );
  }

  getCategories(isShowLoader = true) {
    return this.apiService.get(`${API.SIGN_UP_ROUTES.categories}`, false, true, isShowLoader);
  }

  getCountry(isShowLoader = true) {
    return this.apiService.get(`${API.SIGN_UP_ROUTES.countries}`, false, true, isShowLoader);
  }

  getState(id, isShowLoader = true) {
    return this.apiService.get(
      `${API.SIGN_UP_ROUTES.states}` + id,
      false,
      true
      , isShowLoader
    );
  }

  getCities(id, isShowLoader = true) {
    return this.apiService.get(
      `${API.SIGN_UP_ROUTES.cities}` + id,
      false,
      true, isShowLoader
    );
  }

  changePasswordData(params) {
    return this.apiService.post(
      `${API.CHANGE_PASSWORD_ROUTES.changePassword}`,
      params,
      true,
    );
  }

  getAddressInfo(latitude, longitude) {
    return new Promise((resolve, reject) => {
      const geoCoder = new google.maps.Geocoder();
      geoCoder.geocode(
        { location: { lat: latitude, lng: longitude } },
        (results, status) => {
          if (status === 'OK') {
            if (results[0]) {
              const address = results[0].formatted_address;
              const addressArray = address.split(',');
              const finalResponse = {
                googleAddress: address,
                state: '',
                country: '',
                zipcode: '',
              };
              const addressLength = addressArray.length;
              if (addressLength >= 3) {
                finalResponse.country = addressArray[addressLength - 1].trim();
                const state = addressArray[addressLength - 2];
                finalResponse.state = state.replace(/[0-9]/g, '').trim();
                const zipcode = addressArray[addressLength - 2];
                finalResponse.zipcode = zipcode.replace(/\D/g, '').trim();
              } else if (addressLength === 2) {
                finalResponse.country = addressArray[addressLength - 1].trim();
              }
              return resolve({ status: 1, data: finalResponse });
            } else {
              return resolve({ status: 3 });
            }
          } else {
            return resolve({ status: 3 });
          }
        },
      );
    });
  }
}
