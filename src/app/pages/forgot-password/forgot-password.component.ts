// external
import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

// internal
import { HttpRequestsService } from '@services/http-requests.service';
import { FormService } from '@services/form.service';
import { AuthenticationService } from '@services/auth.service';

import { Constants, URL_ROUTES } from '@constant/constants';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnInit {
  public forgotpasswordForm: FormGroup;
  public logoPath = Constants.GROCERIES_LOGO;
  public messageList: any = {
    email: '',
  };

  constructor(
    private router: Router,
    private formService: FormService,
    public translation: TranslateService,
    public httpService: HttpRequestsService,
    public authService: AuthenticationService,
  ) {}

  ngOnInit(): void {
    this.initializeForgotPasswordForm();
    this.initializeMessages();
  }

  initializeForgotPasswordForm() {
    this.forgotpasswordForm = new FormGroup({
      email: new FormControl(null, [
        Validators.required,
        Validators.pattern(Constants.REGEX.EMAIL_PATTERN),
      ]),
    });
  }

  initializeMessages() {
    this.messageList.email = {
      pattern: this.translation.instant('forgotPassword.emailInvalid'),
      required: this.translation.instant('forgotPassword.emailRequired'),
    };
  }

  onSubmit() {
    this.formService.markFormGroupTouched(this.forgotpasswordForm);
    if (this.forgotpasswordForm.invalid) {
      return;
    }
    this.authService
      .forgotPassword(this.forgotpasswordForm.value)
      .then((res) => {
        this.router.navigate([
          `${URL_ROUTES.RESET_PASSWORD}`,
          this.forgotpasswordForm.value.email,
        ]);
      });
  }

  onBackToLogin() {
    this.router.navigate([`${URL_ROUTES.LOGIN}`]);
  }
}
