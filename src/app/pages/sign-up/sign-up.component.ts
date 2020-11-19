// external
import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormGroup,
  Validators,
  FormControl,
  FormBuilder,
} from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

// internal
import { AuthenticationService } from '@services/auth.service';
import { FormService } from '@services/form.service';
import { ValidationService } from '@services/validation.service';

import { Constants, URL_ROUTES } from '@constant/constants';
import { LocalStorageService } from '@services/local-storage.service';
import { ProductService } from '@services/product.service';
import { UtilityService } from '@services/utility.service';
import { GooglePlaceDirective } from 'ngx-google-places-autocomplete/ngx-google-places-autocomplete.directive';
import { isEmpty } from 'lodash';
import { AddressService } from '@services/address.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent implements OnInit {
  @ViewChild('fileInput') photoInput;
  @ViewChild('placesRef') placesRef: GooglePlaceDirective;
  public signUpForm: FormGroup;
  public logoPath = Constants.GROCERIES_LOGO;
  public eyeShow = false;
  public fileToUpload: File = null;
  public messageList: any = {
    profileImage: '',
    storename: '',
    categoryId: '',
    email: '',
    mobile: '',
    addressLine1: '',
    country: '',
    stateId: '',
    cityId: '',
    zipcode: '',
    password: '',
    confirmPassword: '',
  };
  public categoriesList = [];
  public countryList = [];
  public stateList = [];
  public cityList = [];
  public imgURL: any;
  public imageAttachmentId: any;
  public latitude: number;
  public longitude: number;
  public zoom: number;
  public isShowConfirmPassword = false;
  address: any;
  cntry: any;
  state: any;
  city: any;
  uploadLogoPath = Constants.STORE_LOGO_UPLOAD;
  constructor(
    private router: Router,
    private formService: FormService,
    public translation: TranslateService,
    public validationService: ValidationService,
    private fb: FormBuilder,
    public authService: AuthenticationService,
    private localStorage: LocalStorageService,
    private productService: ProductService,
    private utilityService: UtilityService,
    private addressService: AddressService
  ) { }

  ngOnInit(): void {
    // this.setCurrentLocation();
    this.initializeSignUpForm();
    this.initializeMessages();
    this.getCategories();
    this.getCountry();
  }

  initializeSignUpForm() {
    this.signUpForm = this.fb.group(
      {
        profileImage: new FormControl(null, Validators.required),
        storename: new FormControl(null, [Validators.required, Validators.minLength(4), Validators.maxLength(100)]),
        categoryId: new FormControl('', Validators.required),
        email: new FormControl(null, [
          Validators.required,
          Validators.pattern(Constants.REGEX.EMAIL_PATTERN),
        ]),
        mobile: new FormControl(null, [
          Validators.required,
          Validators.pattern(Constants.REGEX.PHONE_PATTERN)
        ]),
        addressLine1: new FormControl(null, Validators.required),
        addressLine2: new FormControl(null),
        country: new FormControl('', Validators.required),
        stateId: new FormControl('', Validators.required),
        cityId: new FormControl('', Validators.required),
        cityName: new FormControl('', Validators.required),
        zipcode: new FormControl(null, [Validators.required, Validators.minLength(4), Validators.maxLength(8)]),
        password: new FormControl(null, [
          Validators.required,
          Validators.pattern(Constants.REGEX.PASSWORD_PATTERN),
        ]),
        confirmPassword: new FormControl(null, Validators.required),
        latitude: new FormControl(null),
        longitude: new FormControl(null)
      },
      {
        validators: this.validationService.confirmedValidator(
          'password',
          'confirmPassword',
        ),
      },
    );
  }

  initializeMessages() {
    this.messageList.profileImage = {
      required: this.translation.instant('signUp.logoRequired'),
    };
    this.messageList.storename = {
      required: this.translation.instant('signUp.storeNameRequired'),
      minlength: this.translation.instant('signUp.storeNameMin'),
      maxlength: this.translation.instant('signUp.storeNameMax'),
    };
    this.messageList.categoryId = {
      required: this.translation.instant('signUp.storeCategoryRequired'),
    };
    this.messageList.email = {
      required: this.translation.instant('signUp.emailRequired'),
      pattern: this.translation.instant('signUp.emailInvalid'),
    };
    this.messageList.mobile = {
      required: this.translation.instant('signUp.phoneRequired'),
      pattern: this.translation.instant('signUp.phoneInvalid')
    };
    this.messageList.addressLine1 = {
      required: this.translation.instant('signUp.addressLine1Required'),
    };
    this.messageList.country = {
      required: this.translation.instant('signUp.countryRequired'),
    };
    this.messageList.stateId = {
      required: this.translation.instant('signUp.stateRequired'),
    };
    this.messageList.cityId = {
      required: this.translation.instant('signUp.cityRequired'),
    };
    this.messageList.zipcode = {
      required: this.translation.instant('signUp.zipCodeRequired'),
      minlength: this.translation.instant('signUp.zipCodeMin'),
      maxlength: this.translation.instant('signUp.zipCodeMax'),
    };
    this.messageList.password = {
      pattern: this.translation.instant('signUp.passwordInvalid'),
      required: this.translation.instant('signUp.passwordRequired'),
    };
    this.messageList.confirmPassword = {
      required: this.translation.instant('signUp.confirmPasswordRequired'),
      confirmedValidator: this.translation.instant(
        'signUp.passwordConfirmPasswordNotMatch',
      ),
    };
  }


  setAddressFields(addressData) {
    const result = addressData.googleAddress.match(/[^,]+,[^,]+/g);
    this.signUpForm.controls.addressLine1.setValue(
      result[0] ? result[0] : '',
    );
    this.signUpForm.controls.addressLine2.setValue(
      (result[1] ? result[1] : '') + (result[2] ? result[2] : '')
    );
    this.signUpForm.controls.zipcode.setValue(
      addressData.zipcode ? addressData.zipcode : '',
    );
    this.signUpForm.controls.country.setValue('');
    this.signUpForm.controls.stateId.setValue('');
    this.signUpForm.controls.cityId.setValue('');
    this.signUpForm.controls.cityName.setValue('');
    if (addressData.country !== '') {
      const country = this.countryList.filter((item) => {
        return item.COUNTRY_NAME.includes(addressData.country);
      });
      if (country && country.length > 0) {
        const countryId = country[0].ID;
        if (countryId) {
          this.signUpForm.controls.country.setValue(countryId);
          this.authService.getState(countryId).then((res: any) => {
            this.stateList = res.data;
            if (addressData.state !== '') {
              const state = this.stateList.filter((item) => {
                return item.STATE_NAME.includes(addressData.state);
              });
              if (state && state.length > 0) {
                const stateId = state[0].id;
                if (stateId) {
                  this.signUpForm.controls.stateId.setValue(stateId);
                  this.getCity(stateId);
                }
              }
            }
          });
        }
      }
    }
  }

  async placeMarker(position: any) {
    this.latitude = position.coords.lat;
    this.longitude = position.coords.lng;
    const addressInfo: any = await this.authService.getAddressInfo(
      this.latitude,
      this.longitude,
    );
    if (addressInfo.status === 1) {
      this.setAddressFields(addressInfo.data);
    }
  }

  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
    if (files.length === 0) {
      return;
    }
    const mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onload = (_event) => {
      this.imgURL = reader.result;
      this.signUpForm.get('profileImage').setValue(reader.result);
    };

    const formData = new FormData();
    formData.append('file', this.fileToUpload);
    this.productService.upload(formData).then((res: any) => {
      if (res.attachmentId) {
        this.imageAttachmentId = res.attachmentId;
        this.photoInput.nativeElement.value = '';
      }
    });
  }

  onRemoveImage() {
    this.imgURL = '';
    this.imageAttachmentId = '';
    this.fileToUpload = null;
    this.signUpForm.get('profileImage').setValue(null);
  }

  onSubmit() {
    this.formService.markFormGroupTouched(this.signUpForm);
    if (this.signUpForm.invalid) {
      if (this.signUpForm.controls.profileImage.invalid) {
        this.translation.get('signUp.logoRequired').subscribe((res: string) => {
          this.utilityService.showErrorToast(res);
        });
      }
      return;
    }
    const signUpData = {
      ...this.signUpForm.value,
    };
    delete signUpData.confirmPassword;
    if (this.imageAttachmentId) {
      signUpData.profileImage = this.imageAttachmentId;
    }
    if (this.latitude && this.longitude) {
      signUpData.latitude = this.latitude;
      signUpData.longitude = this.longitude;
    }
    this.authService.signUp(signUpData).then((res: any) => {
      this.localStorage.storeItem(Constants.TOKEN, res.token);
      this.localStorage.storeItem(Constants.SID, res.sid);
      this.localStorage.storeItem(Constants.SHOP_TIME, false);
      this.localStorage.storeItem(Constants.CATEGORYID, res.categoryid);
      this.router.navigate([`${URL_ROUTES.SET_TIME}`, res.sid]);
    });
  }

  toggleEyeShow() {
    this.eyeShow = !this.eyeShow;
  }

  toggleisShowConfirmPassword() {
    this.isShowConfirmPassword = !this.isShowConfirmPassword;
  }

  backToLogin() {
    this.router.navigate([`${URL_ROUTES.LOGIN}`]);
  }

  getCategories() {
    this.authService.getCategories().then((res: any) => {
      this.categoriesList = res.data;
    });
  }

  getCountry() {
    this.authService.getCountry().then((res: any) => {
      this.countryList = res.data;
    });
  }

  onCountryChange(countryValue) {
    this.getState(countryValue);
  }

  getState(id) {
    return new Promise((resolve, reject) => {
      this.authService.getState(id).then((res: any) => {
        this.stateList = res.data;
        resolve(this.stateList);
      });
    });
  }

  onStateChange(stateValue) {
    this.getCity(stateValue);
  }
  getCity(id) {
    return new Promise((resolve, reject) => {
      this.authService.getCities(id).then((res: any) => {
        this.cityList = res.data;
        resolve(this.cityList);
      });
    });
  }

  getAddress(place: any) {
    this.signUpForm.controls.addressLine1 = place.formatted_address;
  }

  async handleAddressChange(address) {
    this.cntry = '';
    this.state = '';
    this.city = '';
    this.signUpForm.controls.country.setValue('');
    this.signUpForm.controls.stateId.setValue('');
    this.signUpForm.controls.cityId.setValue('');
    this.signUpForm.controls.cityName.setValue('');
    this.signUpForm.controls.addressLine2.setValue('');
    this.signUpForm.controls.zipcode.setValue('');
    this.signUpForm.controls.latitude.setValue(address.geometry.location.lat());
    this.signUpForm.controls.longitude.setValue(address.geometry.location.lng());
    let streetNumber = '';
    let route = '';
    address.address_components.map(x => {

      x.types.map(y => {
        if (y.includes('street_number')) {
          streetNumber = x.long_name;
        }
        if (y.includes('route')) {
          route = x.long_name;
        }
        if (y.includes('country')) {
          this.cntry = x.short_name === 'US' ? 'USA' : x.short_name;
        }
        if (y.includes('administrative_area_level_1')) {
          this.state = x.long_name;
        }
        if ([y].includes('locality') || [y].includes('neighborhood')) {
          this.city = x.short_name;
        }
        if (y.includes('postal_code') && isEmpty(this.signUpForm.controls.zipcode.value)) {
          this.signUpForm.controls.zipcode.setValue(x.long_name);
        }
      });
    });
    this.signUpForm.controls.addressLine1.setValue(streetNumber + ' ' + route);
    if (this.cntry) {
      this.cntry = this.countryList.findIndex(k => k.COUNTRY_NAME === this.cntry);
      if (this.cntry >= 0) {
        this.signUpForm.controls.country.setValue(this.countryList[this.cntry].ID);
        if (this.stateList.length === 0) {
          await this.getState(this.signUpForm.controls.country.value);
        }
        if (this.stateList.length > 0 && !!this.state) {
          const checkStateIndex = this.stateList.findIndex(z => z.STATE_NAME === this.state);
          if (checkStateIndex >= 0) {
            this.signUpForm.controls.stateId.setValue(this.stateList[this.stateList.findIndex(z => z.STATE_NAME === this.state)].id);
          } else {
            this.signUpForm.controls.stateId.setValue('');
            this.signUpForm.controls.cityId.setValue('');
            this.signUpForm.controls.cityName.setValue('');
          }
        } else {
          this.signUpForm.controls.stateId.setValue('');
        }
        await this.getCity(this.signUpForm.controls.stateId.value);
        if (this.cityList.length > 0 && !!this.city) {
          // const cId = this.addressService.getCityName(address, false, this.cityList, this.signUpForm);
          // this.signUpForm.controls.cityId.setValue(cId);
          this.getCityName(address);
        } else {
          this.signUpForm.controls.cityId.setValue('');
          this.signUpForm.controls.cityName.setValue('');
        }
      } else {
        this.signUpForm.controls.country.setValue('');
        this.signUpForm.controls.stateId.setValue('');
        this.signUpForm.controls.cityId.setValue('');
        this.signUpForm.controls.cityName.setValue('');
      }
    }
  }


  getCityName(address, isNeighborhood = false) {
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
    const checkCityIndex = this.cityList.findIndex(c => c.CITY === this.city);
    if (checkCityIndex >= 0) {
      this.signUpForm.controls.cityId.setValue(this.cityList[checkCityIndex].id);
      this.signUpForm.controls.cityName.setValue(this.cityList[checkCityIndex].CITY);
    } else {
      if (!isNeighborhood) {
        this.getCityName(address, true);
      } else {
        this.signUpForm.controls.cityId.setValue('');
        this.signUpForm.controls.cityName.setValue('');
      }
    }
  }
}
