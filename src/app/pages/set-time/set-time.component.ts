// external
import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  Validators,
  FormControl,
  FormBuilder,
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

// internal
import { FormService } from '@services/form.service';
import { ValidationService } from '@services/validation.service';
import { AuthenticationService } from '@services/auth.service';

import { Constants, URL_ROUTES } from '@constant/constants';
import { LocalStorageService } from '@services/local-storage.service';
import { UtilityService } from '@services/utility.service';
import * as moment from 'moment';

@Component({
  selector: 'app-set-time',
  templateUrl: './set-time.component.html',
  styleUrls: ['./set-time.component.scss'],
})
export class SetTimeComponent implements OnInit {
  public setTimeForm: FormGroup;
  public logoPath = Constants.GROCERIES_LOGO;
  time = { hour: 13, minute: 30 };
  public messageList: any = {
    weekdaysOpenTime: '',
    weekdaysCloseTime: '',
  };
  public storeId: any;
  public timeVariables = Constants.TIME_VARIABLES;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formService: FormService,
    public translation: TranslateService,
    public validationService: ValidationService,
    public authService: AuthenticationService,
    private localStorage: LocalStorageService,
    private util: UtilityService
  ) { }

  ngOnInit(): void {
    this.storeId = this.route.snapshot.params['storeId'];
    this.initializeSetTimeForm();
    this.initializeMessages();
  }

  initializeSetTimeForm() {
    this.setTimeForm = new FormGroup({
      weekdaysOpenTime: new FormControl(null, Validators.required),
      weekdaysCloseTime: new FormControl(null, Validators.required),
      saturdayOpenTime: new FormControl(null),
      saturdayCloseTime: new FormControl(null),
      sundayOpenTime: new FormControl(null),
      sundayCloseTime: new FormControl(null),
      isSundayOpen: new FormControl(false),
      isSaturdayOpen: new FormControl(false),
    });
  }

  initializeMessages() {
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

  convertToMilatryTime(weekdaysCloseTimeObj) {
    const weekdaysCloseTimeObjminute = weekdaysCloseTimeObj.minute < 10 ? `0${weekdaysCloseTimeObj.minute}` : weekdaysCloseTimeObj.minute;
    const weekdaysCloseTimeObjhour = weekdaysCloseTimeObj.hour < 10 ? `0${weekdaysCloseTimeObj.hour}` : weekdaysCloseTimeObj.hour;
    return `${weekdaysCloseTimeObjhour}:${weekdaysCloseTimeObjminute}`;
  }

  onSubmit() {
    this.formService.markFormGroupTouched(this.setTimeForm);
    if (this.setTimeForm.invalid) {
      return;
    }
    const weekdaysCloseTime = this.convertToMilatryTime(this.setTimeForm.controls.weekdaysCloseTime.value);
    const weekdaysOpenTime = this.convertToMilatryTime(this.setTimeForm.controls.weekdaysOpenTime.value);
    const weekdaysOpen = moment(weekdaysOpenTime, 'HH:mm');
    const weekdaysClose = moment(weekdaysCloseTime, 'HH:mm');
    if (weekdaysClose.isBefore(weekdaysOpen)) {
      this.translation.get('setTime.weekdaysCloseOlderRequired').subscribe((res: string) => {
        this.util.showErrorToast(res);
      });
      return;
    }
    const shopTimeData: any = {
      weekdaysCloseTime,
      weekdaysOpenTime,
      storeId: this.storeId,
    };
    if (this.setTimeForm.controls.isSundayOpen.value) {
      const sundayCloseTime = this.convertToMilatryTime(this.setTimeForm.controls.sundayCloseTime.value);
      const sundayOpenTime = this.convertToMilatryTime(this.setTimeForm.controls.sundayOpenTime.value);
      const sundayOpen = moment(sundayOpenTime, 'HH:mm');
      const sundayClose = moment(sundayCloseTime, 'HH:mm');
      if (sundayClose.isBefore(sundayOpen)) {
        this.translation.get('setTime.sundayCloseOlderRequired').subscribe((res: string) => {
          this.util.showErrorToast(res);
        });
        return;
      }
      shopTimeData.sundayOpenTime = sundayOpenTime;
      shopTimeData.sundayCloseTime = sundayCloseTime;
    }
    if (this.setTimeForm.controls.isSaturdayOpen.value) {
      const saturdayCloseTime = this.convertToMilatryTime(this.setTimeForm.controls.saturdayCloseTime.value);
      const saturdayOpenTime = this.convertToMilatryTime(this.setTimeForm.controls.saturdayOpenTime.value);
      const saturdayOpen = moment(saturdayOpenTime, 'HH:mm');
      const saturdayClose = moment(saturdayCloseTime, 'HH:mm');
      if (saturdayClose.isBefore(saturdayOpen)) {
        this.translation.get('setTime.saturdayCloseOlderRequired').subscribe((res: string) => {
          this.util.showErrorToast(res);
        });
        return;
      }
      shopTimeData.saturdayOpenTime = saturdayOpenTime;
      shopTimeData.saturdayCloseTime = saturdayCloseTime;
    }
    this.authService.setTime(shopTimeData).then((res) => {
      if (this.localStorage.readStorage(Constants.SHOP_TIME)) {
        this.localStorage.removeStorage(Constants.SHOP_TIME);
      }
      this.router.navigate([`${URL_ROUTES.ADMIN_HOME}`]);
    });
  }

  backToLogin() {
    if (this.localStorage.readStorage(Constants.TOKEN)) {
      this.localStorage.clearStorage();
    }
    this.router.navigate([`${URL_ROUTES.LOGIN}`]);
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

  onChangeSwitch(event, isSunday) {
    if (isSunday) {
      if (event) {
        this.setTimeForm.controls.sundayCloseTime.setValidators([Validators.required]);
        this.setTimeForm.controls.sundayOpenTime.setValidators([Validators.required]);
      } else {
        this.setTimeForm.controls.sundayCloseTime.setValidators(null);
        this.setTimeForm.controls.sundayOpenTime.setValidators(null);
        this.setTimeForm.controls.sundayOpenTime.updateValueAndValidity();
        this.setTimeForm.controls.sundayCloseTime.updateValueAndValidity();
      }
    } else {
      if (event) {
        this.setTimeForm.controls.saturdayCloseTime.setValidators([Validators.required]);
        this.setTimeForm.controls.saturdayOpenTime.setValidators([Validators.required]);
      } else {
        this.setTimeForm.controls.saturdayCloseTime.setValidators(null);
        this.setTimeForm.controls.saturdayOpenTime.setValidators(null);
        this.setTimeForm.controls.saturdayOpenTime.updateValueAndValidity();
        this.setTimeForm.controls.saturdayCloseTime.updateValueAndValidity();
      }
    }
  }
}
