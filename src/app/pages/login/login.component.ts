// external
import { Component } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

// internal
import { HttpRequestsService } from '@services/http-requests.service';
import { FormService } from '@services/form.service';
import { AuthenticationService } from '@services/auth.service';
import { LocalStorageService } from '@services/local-storage.service';

import { Constants, URL_ROUTES } from '@constant/constants';
import { UtilityService } from '@services/utility.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  public logoPath = Constants.GROCERIES_LOGO;
  public loginForm: FormGroup;
  public messageList: any = {
    email: '',
    password: '',
  };

  constructor(
    public httpService: HttpRequestsService,
    public authService: AuthenticationService,
    private formService: FormService,
    private router: Router,
    public translation: TranslateService,
    private localStorage: LocalStorageService,
    private utilityService: UtilityService
  ) {
    this.loginForm = new FormGroup({
      email: new FormControl(null, [
        Validators.required,
        Validators.pattern(Constants.REGEX.EMAIL_PATTERN),
      ]),
      password: new FormControl(null, [
        Validators.required,
      ]),
    });
    this.initializeMessages();
  }

  initializeMessages() {
    this.messageList.email = {
      pattern: this.translation.instant('login.emailInvalid'),
      required: this.translation.instant('login.emailRequired'),
    };

    this.messageList.password = {
      required: this.translation.instant('login.passwordRequired')
    };
  }

  /**
   * onSubmit(data, isValid) => check login credentials with api call @login
   * @param data in form control field value
   * @param isValid in form validation done or not
   */
  onSubmit() {
    this.formService.markFormGroupTouched(this.loginForm);
    if (this.loginForm.invalid) {
      return;
    }
    localStorage.clear();
    this.authService.login(this.loginForm.value).then((res: any) => {
      if (res.status) {
        this.localStorage.storeItem(Constants.TOKEN, res.token);
        this.localStorage.storeItem(Constants.SID, res.sid.sid);
        this.localStorage.storeItem(Constants.CATEGORYID, res.sid.categoryid);
        if (res.time === false) {
          this.localStorage.storeItem(Constants.SHOP_TIME, res.time);
          this.router.navigate([`${URL_ROUTES.SET_TIME}/` + res.sid.sid]);
        } else {
          this.router.navigate([`${URL_ROUTES.ADMIN_HOME}`]);
        }
      }
    }, err => {
      this.utilityService.showErrorMessagePositionChange(err.error);
    });
  }
}
