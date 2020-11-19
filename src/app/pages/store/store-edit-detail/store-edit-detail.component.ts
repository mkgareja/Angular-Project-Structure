// external
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {
  FormGroup,
  Validators,
  FormControl,
  FormBuilder,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

// internal
import { AuthenticationService } from '@services/auth.service';
import { FormService } from '@services/form.service';
import { ValidationService } from '@services/validation.service';
import { StoreService } from '@services/store.service';

import { Constants, URL_ROUTES } from '@constant/constants';
import { ProductService } from '@services/product.service';
import { LocalStorageService } from '@services/local-storage.service';
import { uniq } from 'lodash';
import * as moment from 'moment';
import { UtilityService } from '@services/utility.service';
import { GooglePlaceDirective } from 'ngx-google-places-autocomplete';
import { isEmpty } from 'lodash';
import { adminLteConf } from 'src/app/admin-lte.conf';

@Component({
  selector: 'app-store-edit-detail',
  templateUrl: './store-edit-detail.component.html',
  styleUrls: ['./store-edit-detail.component.scss'],
})
export class StoreEditDetailsComponent implements OnInit {
  @ViewChild('fileInput') photoInput;
  @ViewChild('placesRef') placesRef: GooglePlaceDirective;
  public storeId: any;
  public storeDetails: any;
  public storeTimeDetails: any;
  public isFormDisabled = true;
  public storeEditDetailForm: FormGroup;
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
    // addressLine2: '',
    country: '',
    stateId: '',
    cityId: '',
    zipcode: '',
    weekdaysOpenTime: '',
    weekdaysCloseTime: ''
  };
  public categoriesList = [];
  public countryList = [];
  public stateList = [];
  public cityList = [];
  public imgURL: any;
  public imageArray = [];
  public storeDetailsValue: any;
  public timeVariables = Constants.TIME_VARIABLES;
  @ViewChild('fileInput') fileInput: ElementRef;
  address: any;
  cntry: any;
  state: any;
  city: any;
  constructor(
    private router: Router,
    private formService: FormService,
    public translation: TranslateService,
    public validationService: ValidationService,
    private fb: FormBuilder,
    public authService: AuthenticationService,
    private route: ActivatedRoute,
    private storeService: StoreService,
    private productService: ProductService,
    private localStorage: LocalStorageService,
    private util: UtilityService
  ) { }

  ngOnInit(): void {
    this.initializeStoreEditDetailForm();
    const details = JSON.parse(this.localStorage.readStorage(Constants.SHOP_DETAILS));
    if (details) {
      this.storeDetails = details.storeDetails;
      this.storeTimeDetails = details.storeTimeDetails;
      this.setEditForm(this.storeDetails, this.storeTimeDetails);
    }

    this.getStoreDetails();
    this.initializeMessages();
    this.getCategories(false);
    this.getCountry(false);
  }

  getStoreDetails() {
    this.storeId = this.route.snapshot.params.id;
    const isShowLoader = this.storeDetails ? false : true;
    this.storeService.getStoreDeatils(this.storeId, isShowLoader).then((res: any) => {
      this.storeDetails = res.data;
      this.storeTimeDetails = res.time;
      this.localStorage.storeItem(Constants.SHOP_DETAILS, JSON.stringify({
        storeDetails: this.storeDetails, storeTimeDetails: this.storeTimeDetails
      }));
      this.localStorage.storeItem(Constants.CATEGORYID, res.data.categoryid);
      this.storeService.emitMenuChangeEvent(res.data.categoryid);
      this.setEditForm(res.data, res.time);
    });
  }

  initializeStoreEditDetailForm() {
    this.storeEditDetailForm = this.fb.group({
      profileImage: new FormControl(null),
      storename: new FormControl(null, Validators.required),
      categoryId: new FormControl('', Validators.required),
      email: new FormControl(null, [
        Validators.required,
        Validators.pattern(Constants.REGEX.EMAIL_PATTERN),
      ]),
      mobile: new FormControl(null, [
        Validators.required,
        Validators.pattern(Constants.REGEX.PHONE_PATTERN),
      ]),
      addressLine1: new FormControl(null, Validators.required),
      addressLine2: new FormControl(null),
      country: new FormControl('', Validators.required),
      stateId: new FormControl('', Validators.required),
      cityId: new FormControl('', Validators.required),
      cityName: new FormControl('', Validators.required),
      zipcode: new FormControl(null, Validators.required),
      weekdaysOpenTime: new FormControl(null, Validators.required),
      weekdaysCloseTime: new FormControl(null, Validators.required),
      saturdayOpenTime: new FormControl(null),
      saturdayCloseTime: new FormControl(null),
      sundayOpenTime: new FormControl(null),
      sundayCloseTime: new FormControl(null),
      isSundayOpen: new FormControl(false),
      isSaturdayOpen: new FormControl(false),
      latitude: new FormControl(null),
      longitude: new FormControl(null)
    });
  }

  async setEditForm(data, time) {
    const getFields = Object.keys(this.storeEditDetailForm.controls);
    if (data.image) {
      this.imgURL = data.image.thumb;
      this.imageArray.push(data.image.id);
    }
    if (time.length > 0) {
      time.forEach((element) => {
        if (element.openTime) {
          const hr = element.openTime.split(':');
          element.openTime = hr[0] + ':' + hr[1];
        }
        if (element.closeTime) {
          const hr = element.closeTime.split(':');
          element.closeTime = hr[0] + ':' + hr[1];
        }
      });
    }
    if (data.countryid && this.stateList.length === 0) {
      this.getState(data.countryid, false);
    }
    if (data.stateid && this.cityList.length === 0) {
      await this.getCity(data.stateid, false);
    }
    getFields.map((fieldName) => {
      if (fieldName !== 'profileImage') {
        this.storeEditDetailForm.controls[fieldName].setValue(
          data[fieldName] ? data[fieldName] : null,
        );
      }
    });
    this.storeEditDetailForm.controls.latitude.setValue(data.latitude);
    this.storeEditDetailForm.controls.longitude.setValue(data.longitude);
    const saturdayTime = this.fetchTime(time, 'saturday');
    const sundayTime = this.fetchTime(time, 'sunday');
    this.storeEditDetailForm.controls.isSaturdayOpen.setValue(saturdayTime ? true : false);
    this.storeEditDetailForm.controls.isSundayOpen.setValue(sundayTime ? true : false);
    if (this.storeEditDetailForm.controls.isSaturdayOpen.value) {
      this.storeEditDetailForm.controls.saturdayOpenTime.setValidators([Validators.required]);
      this.storeEditDetailForm.controls.saturdayCloseTime.setValidators([Validators.required]);
    }
    if (this.storeEditDetailForm.controls.isSundayOpen.value) {
      this.storeEditDetailForm.controls.sundayCloseTime.setValidators([Validators.required]);
      this.storeEditDetailForm.controls.sundayOpenTime.setValidators([Validators.required]);
    }
    this.storeEditDetailForm.controls.categoryId.setValue(
      data.categoryid ? data.categoryid : '',
    );
    this.storeEditDetailForm.controls.country.setValue(
      data.countryid ? data.countryid : '',
    );
    this.storeEditDetailForm.controls.stateId.setValue(
      data.stateid ? data.stateid : '',
    );
    const checkCityIndex = this.cityList.findIndex(c => c.id === data.cityid);
    this.storeEditDetailForm.controls.cityId.setValue(
      data.cityid ? data.cityid : '',
    );
    this.storeEditDetailForm.controls.cityName.setValue(
      data.cityid ? this.cityList[checkCityIndex].CITY : '',
    );
    const weekdaysTimes = this.fetchTime(time, 'weekdays');
    this.storeEditDetailForm.controls.weekdaysOpenTime.setValue(
      weekdaysTimes ? this.convertToNormalTime(weekdaysTimes.openTime) : '',
    );
    this.storeEditDetailForm.controls.weekdaysCloseTime.setValue(
      weekdaysTimes ? this.convertToNormalTime(weekdaysTimes.closeTime) : '',
    );
    this.storeEditDetailForm.controls.saturdayOpenTime.setValue(
      this.storeEditDetailForm.controls.isSaturdayOpen.value ? this.convertToNormalTime(saturdayTime.openTime) : '',
    );
    this.storeEditDetailForm.controls.saturdayCloseTime.setValue(
      this.storeEditDetailForm.controls.isSaturdayOpen.value ? this.convertToNormalTime(saturdayTime.closeTime) : '',
    );
    this.storeEditDetailForm.controls.sundayOpenTime.setValue(
      this.storeEditDetailForm.controls.isSundayOpen.value ? this.convertToNormalTime(sundayTime.openTime) : '',
    );
    this.storeEditDetailForm.controls.sundayCloseTime.setValue(
      this.storeEditDetailForm.controls.isSundayOpen.value ? this.convertToNormalTime(sundayTime.closeTime) : '',
    );
    this.storeDetailsValue = JSON.parse(
      JSON.stringify(this.storeEditDetailForm.value),
    );
    this.setEnableDisableFields();
  }

  fetchTime(times, day) {
    const dayTime = times.filter(tmpTime => {
      if (tmpTime.day === day) {
        return tmpTime;
      }
    });
    return dayTime.length > 0 ? dayTime[0] : undefined;
  }

  convertToNormalTime(weekdaysCloseTimeObj) {
    const times = weekdaysCloseTimeObj.split(':');
    const data: any = {};
    if (times.length > 0) {
      data.hour = +times[0];
    }
    if (times.length > 1) {
      data.minute = +times[1];
    }
    return data;
  }

  setEnableDisableFields() {
    const getFields = Object.keys(this.storeEditDetailForm.controls);
    if (this.isFormDisabled) {
      getFields.map((fieldName) => {
        this.storeEditDetailForm.controls[fieldName].disable();
      });
    } else {
      getFields.map((fieldName) => {
        if (fieldName !== 'email' && (fieldName !== 'categoryId' || this.storeDetails.product_count === 0)) {
          this.storeEditDetailForm.controls[fieldName].enable();
        }
      });
    }
  }

  initializeMessages() {
    this.messageList.profileImage = {
      required: this.translation.instant('storeEditDetail.logoRequired'),
    };
    this.messageList.storename = {
      required: this.translation.instant('storeEditDetail.storeNameRequired'),
    };
    this.messageList.categoryId = {
      required: this.translation.instant(
        'storeEditDetail.storeCategoryRequired',
      ),
    };
    this.messageList.email = {
      required: this.translation.instant('storeEditDetail.emailRequired'),
      pattern: this.translation.instant('storeEditDetail.emailInvalid'),
    };
    this.messageList.mobile = {
      required: this.translation.instant('storeEditDetail.phoneRequired'),
      pattern: this.translation.instant('storeEditDetail.phoneInvalid'),
    };
    this.messageList.addressLine1 = {
      required: this.translation.instant(
        'storeEditDetail.addressLine1Required',
      ),
    };
    this.messageList.country = {
      required: this.translation.instant('storeEditDetail.countryRequired'),
    };
    this.messageList.stateId = {
      required: this.translation.instant('storeEditDetail.stateRequired'),
    };
    this.messageList.cityId = {
      required: this.translation.instant('storeEditDetail.cityRequired'),
    };
    this.messageList.zipcode = {
      required: this.translation.instant('storeEditDetail.zipCodeRequired'),
    };
    this.messageList.weekdaysOpenTime = {
      required: this.translation.instant('setTime.weekdaysOpenRequired'),
    };
    this.messageList.weekdaysCloseTime = {
      required: this.translation.instant('setTime.weekdaysCloseRequired'),
    };
    this.messageList.saturdayCloseTime = {
      required: this.translation.instant('setTime.saturdayCloseRequired'),
    };
    this.messageList.saturdayOpenTime = {
      required: this.translation.instant('setTime.saturdayOpenRequired'),
    };
    this.messageList.sundayCloseTime = {
      required: this.translation.instant('setTime.sundayCloseRequired'),
    };
    this.messageList.sundayOpenTime = {
      required: this.translation.instant('setTime.sundayOpenRequired'),
    };
  }

  handleFileInput(files: FileList) {
    if (!!files) {
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
      };

      const formData = new FormData();
      formData.append('file', this.fileToUpload);
      this.productService.upload(formData).then((res: any) => {
        if (res.attachmentId) {
          this.imageArray.push(res.attachmentId);
          this.photoInput.nativeElement.value = '';
        }
      });
    }
  }

  onRemoveImage() {
    this.imgURL = '';
    this.fileToUpload = null;
    this.imageArray = [];
    this.storeEditDetailForm.get('profileImage').setValue(null);
    this.storeEditDetailForm.get('profileImage').setErrors({ required: true });
  }

  convertToMilatryTime(weekdaysCloseTimeObj) {
    const weekdaysCloseTimeObjminute = weekdaysCloseTimeObj.minute < 10 ? `0${weekdaysCloseTimeObj.minute}` : weekdaysCloseTimeObj.minute;
    const weekdaysCloseTimeObjhour = weekdaysCloseTimeObj.hour < 10 ? `0${weekdaysCloseTimeObj.hour}` : weekdaysCloseTimeObj.hour;
    return `${weekdaysCloseTimeObjhour}:${weekdaysCloseTimeObjminute}`;
  }

  onSubmit() {
    this.formService.markFormGroupTouched(this.storeEditDetailForm);
    if (this.storeEditDetailForm.invalid) {
      return;
    }
    const storeEditDetailData = {
      ...this.storeEditDetailForm.value,
    };
    storeEditDetailData.categoryId = this.storeEditDetailForm.controls.categoryId.value;
    const weekdaysCloseTime = this.convertToMilatryTime(this.storeEditDetailForm.controls.weekdaysCloseTime.value);
    const weekdaysOpenTime = this.convertToMilatryTime(this.storeEditDetailForm.controls.weekdaysOpenTime.value);
    const weekdaysOpen = moment(weekdaysOpenTime, 'HH:mm');
    const weekdaysClose = moment(weekdaysCloseTime, 'HH:mm');
    if (weekdaysClose.isBefore(weekdaysOpen)) {
      this.translation.get('setTime.weekdaysCloseOlderRequired').subscribe((res: string) => {
        this.util.showErrorToast(res);
      });
      return;
    }
    storeEditDetailData.weekdaysCloseTime = weekdaysCloseTime;
    storeEditDetailData.weekdaysOpenTime = weekdaysOpenTime;
    if (this.storeEditDetailForm.controls.isSundayOpen.value) {
      const sundayCloseTime = this.convertToMilatryTime(this.storeEditDetailForm.controls.sundayCloseTime.value);
      const sundayOpenTime = this.convertToMilatryTime(this.storeEditDetailForm.controls.sundayOpenTime.value);
      const sundayOpen = moment(sundayOpenTime, 'HH:mm');
      const sundayClose = moment(sundayCloseTime, 'HH:mm');
      if (sundayClose.isBefore(sundayOpen)) {
        this.translation.get('setTime.sundayCloseOlderRequired').subscribe((res: string) => {
          this.util.showErrorToast(res);
        });
        return;
      }
      storeEditDetailData.sundayOpenTime = sundayOpenTime;
      storeEditDetailData.sundayCloseTime = sundayCloseTime;
    }
    else {
      delete storeEditDetailData.sundayOpenTime;
      delete storeEditDetailData.sundayCloseTime;
    }
    if (this.storeEditDetailForm.controls.isSaturdayOpen.value) {
      const saturdayCloseTime = this.convertToMilatryTime(this.storeEditDetailForm.controls.saturdayCloseTime.value);
      const saturdayOpenTime = this.convertToMilatryTime(this.storeEditDetailForm.controls.saturdayOpenTime.value);
      const saturdayOpen = moment(saturdayOpenTime, 'HH:mm');
      const saturdayClose = moment(saturdayCloseTime, 'HH:mm');
      if (saturdayClose.isBefore(saturdayOpen)) {
        this.translation.get('setTime.saturdayCloseOlderRequired').subscribe((res: string) => {
          this.util.showErrorToast(res);
        });
        return;
      }
      storeEditDetailData.saturdayOpenTime = saturdayOpenTime;
      storeEditDetailData.saturdayCloseTime = saturdayCloseTime;
    }
    else {
      delete storeEditDetailData.saturdayOpenTime;
      delete storeEditDetailData.saturdayCloseTime;
    }
    if (this.imgURL) {
      storeEditDetailData.profileImage = this.imageArray;
    }
    delete storeEditDetailData.isSundayOpen;
    delete storeEditDetailData.isSaturdayOpen;
    storeEditDetailData.profileImage = uniq(storeEditDetailData.profileImage);
    this.storeService
      .editStore(storeEditDetailData, this.storeId)
      .then((res: any) => {
        this.isFormDisabled = true;
        this.onRemoveImage();
        this.getStoreDetails();
      });
  }

  toggleEyeShow() {
    this.eyeShow = !this.eyeShow;
  }

  backToProduct() {
    if (this.isFormDisabled) {
      this.router.navigate([`${URL_ROUTES.STORE_HOME}`]);
    } else {
      this.redirectToDetail();
    }
  }

  getCategories(isShowLoader) {
    this.authService.getCategories(isShowLoader).then((res: any) => {
      this.categoriesList = res.data;
    });
  }

  getCountry(isShowLoader) {
    this.authService.getCountry(isShowLoader).then((res: any) => {
      this.countryList = res.data;
    });
  }

  onCountryChange(countryValue) {
    this.getState(countryValue, false);
  }

  getState(id, isShowLoader) {
    return new Promise((resolve, reject) => {
      this.authService.getState(id, isShowLoader).then((res: any) => {
        this.stateList = res.data;
        resolve(this.stateList);
      });
    });
  }

  onStateChange(stateValue) {
    this.getCity(stateValue, false);
  }
  getCity(id, isShowLoader) {
    return new Promise((resolve, reject) => {
      this.authService.getCities(id, isShowLoader).then((res: any) => {
        this.cityList = res.data;
        resolve(this.cityList);
      });
    });
  }
  redirectToEdit() {
    this.isFormDisabled = false;
    this.setEnableDisableFields();
  }
  redirectToDetail() {
    this.isFormDisabled = true;
    this.storeEditDetailForm.patchValue(this.storeDetailsValue);
    this.setEnableDisableFields();
  }

  onTimeChanged(event, selected) {
    if (selected === Constants.WEEKDAY_OPEN) {
      this.timeVariables.minWeekdayClose = event;
    } else if (selected === Constants.WEEKDAY_CLOSE) {
      this.timeVariables.maxWeekdayOpen = event;
    } else if (selected === Constants.SATURDAY_OPEN) {
      this.timeVariables.minSaturdayClose = event;
    } else if (selected === Constants.SATURDAY_CLOSE) {
      this.timeVariables.maxSaturdayOpen = event;
    } else if (selected === Constants.SUNDAY_OPEN) {
      this.timeVariables.minSundayClose = event;
    } else if (selected === Constants.SUNDAY_CLOSE) {
      this.timeVariables.maxSundayOpen = event;
    }
  }

  uploadImage(imageControl: any) {
    imageControl.click();
  }

  onChangeSwitch(event, isSunday) {
    if (isSunday) {
      if (event) {
        this.storeEditDetailForm.controls.sundayCloseTime.setValidators([Validators.required]);
        this.storeEditDetailForm.controls.sundayOpenTime.setValidators([Validators.required]);
      } else {
        this.storeEditDetailForm.controls.sundayCloseTime.setValidators(null);
        this.storeEditDetailForm.controls.sundayOpenTime.setValidators(null);
        this.storeEditDetailForm.controls.sundayOpenTime.updateValueAndValidity();
        this.storeEditDetailForm.controls.sundayCloseTime.updateValueAndValidity();
      }
    } else {
      if (event) {
        this.storeEditDetailForm.controls.saturdayCloseTime.setValidators([Validators.required]);
        this.storeEditDetailForm.controls.saturdayOpenTime.setValidators([Validators.required]);
      } else {
        this.storeEditDetailForm.controls.saturdayCloseTime.setValidators(null);
        this.storeEditDetailForm.controls.saturdayOpenTime.setValidators(null);
        this.storeEditDetailForm.controls.saturdayOpenTime.updateValueAndValidity();
        this.storeEditDetailForm.controls.saturdayCloseTime.updateValueAndValidity();
      }
    }
  }

  async handleAddressChange(address) {
    this.cntry = '';
    this.state = '';
    this.city = '';
    this.storeEditDetailForm.controls.country.setValue('');
    this.storeEditDetailForm.controls.stateId.setValue('');
    this.storeEditDetailForm.controls.cityId.setValue('');
    this.storeEditDetailForm.controls.cityName.setValue('');
    this.storeEditDetailForm.controls.addressLine2.setValue('');
    this.storeEditDetailForm.controls.zipcode.setValue('');
    this.storeEditDetailForm.controls.latitude.setValue(address.geometry.location.lat());
    this.storeEditDetailForm.controls.longitude.setValue(address.geometry.location.lng());
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
        if (y.includes('postal_code') && isEmpty(this.storeEditDetailForm.controls.zipcode.value)) {
          this.storeEditDetailForm.controls.zipcode.setValue(x.long_name);
        }
      });
    });
    this.storeEditDetailForm.controls.addressLine1.setValue(streetNumber + ' ' + route);
    if (this.cntry) {
      this.cntry = this.countryList.findIndex(k => k.COUNTRY_NAME === this.cntry);
      if (this.cntry >= 0) {
        this.storeEditDetailForm.controls.country.setValue(this.countryList[this.cntry].ID);
        if (this.stateList.length === 0) {
          await this.getState(this.storeEditDetailForm.controls.country.value, false);
        }
        if (this.stateList.length > 0 && !!this.state) {
          const checkStateIndex = this.stateList.findIndex(z => z.STATE_NAME === this.state);
          if (checkStateIndex >= 0) {
            this.storeEditDetailForm.controls.stateId.setValue(this.stateList[checkStateIndex].id);
          } else {
            this.storeEditDetailForm.controls.stateId.setValue('');
            this.storeEditDetailForm.controls.cityId.setValue('');
            this.storeEditDetailForm.controls.cityName.setValue('');
          }
        } else {
          this.storeEditDetailForm.controls.stateId.setValue('');
        }
        await this.getCity(this.storeEditDetailForm.controls.stateId.value, false);
        if (this.cityList.length > 0 && !!this.city) {
          this.getCityName(address);
        } else {
          this.storeEditDetailForm.controls.cityId.setValue('');
          this.storeEditDetailForm.controls.cityName.setValue('');
        }
      } else {
        this.storeEditDetailForm.controls.country.setValue('');
        this.storeEditDetailForm.controls.stateId.setValue('');
        this.storeEditDetailForm.controls.cityId.setValue('');
        this.storeEditDetailForm.controls.cityName.setValue('');
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
      this.storeEditDetailForm.controls.cityId.setValue(this.cityList[checkCityIndex].id);
      this.storeEditDetailForm.controls.cityName.setValue(this.cityList[checkCityIndex].CITY);
    } else {
      if (!isNeighborhood) {
        this.getCityName(address, true);
      } else {
        this.storeEditDetailForm.controls.cityId.setValue('');
        this.storeEditDetailForm.controls.cityName.setValue('');
      }
    }
  }
}
