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
import { HttpRequestsService } from '@services/http-requests.service';
import { FormService } from '@services/form.service';
import { ValidationService } from '@services/validation.service';
import { AuthenticationService } from '@services/auth.service';

import { Constants, URL_ROUTES } from '@constant/constants';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit {
  public resetPasswordForm: FormGroup;
  public logoPath = Constants.GROCERIES_LOGO;
  public eyeShow = false;
  public messageList: any = {
    recoveryCode: '',
    password: '',
    confirmPassword: '',
  };
  public emailId: any;
  public confirmEyeShow = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formService: FormService,
    public translation: TranslateService,
    public httpService: HttpRequestsService,
    public validationService: ValidationService,
    private fb: FormBuilder,
    public authService: AuthenticationService,
  ) { }

  ngOnInit(): void {
    this.emailId = this.route.snapshot.params['emailId'];
    this.initializeResetPasswordForm();
    this.initializeMessages();
  }

  initializeResetPasswordForm() {
    this.resetPasswordForm = this.fb.group(
      {
        recoveryCode: new FormControl(null, Validators.required),
        password: new FormControl(null, [
          Validators.required,
          Validators.pattern(Constants.REGEX.PASSWORD_PATTERN),
          Validators.minLength(Constants.PASSWORD_MIN_LENGTH),
          Validators.maxLength(Constants.PASSWORD_MAX_LENGTH),
        ]),
        confirmPassword: new FormControl(null, [
          Validators.required,
          Validators.minLength(Constants.PASSWORD_MIN_LENGTH),
          Validators.maxLength(Constants.PASSWORD_MAX_LENGTH),
        ]),
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
    this.messageList.recoveryCode = {
      required: this.translation.instant('resetPassword.recoveryCodeRequired'),
    };
    this.messageList.password = {
      required: this.translation.instant('resetPassword.passwordRequired'),
      minlength: this.translation.instant('resetPassword.passwordMinLength'),
      pattern: this.translation.instant('resetPassword.passwordInvalid'),
      maxlength: this.translation.instant('resetPassword.passwordMaxLength'),
    };
    this.messageList.confirmPassword = {
      required: this.translation.instant(
        'resetPassword.confirmPasswordRequired',
      ),
      minlength: this.translation.instant(
        'resetPassword.confirmPasswordMinLength',
      ),
      maxlength: this.translation.instant(
        'resetPassword.confirmPasswordMaxLength',
      ),
      confirmedValidator: this.translation.instant(
        'resetPassword.passwordConfirmPasswordNotMatch',
      ),
    };
  }

  onSubmit() {
    this.formService.markFormGroupTouched(this.resetPasswordForm);
    if (this.resetPasswordForm.invalid) {
      return;
    }
    const resetPasswordInData = {
      password: this.resetPasswordForm.value.password,
      recoveryCode: this.resetPasswordForm.value.recoveryCode,
      email: this.emailId,
    };
    this.authService.resetPassword(resetPasswordInData).then((res) => {
      this.router.navigate([`${URL_ROUTES.LOGIN}`]);
    });
  }

  onToggleEyeShow() {
    this.eyeShow = !this.eyeShow;
  }

  onBackToLogin() {
    this.router.navigate([`${URL_ROUTES.LOGIN}`]);
  }

  onToggleEyeShowConfirm() {
    this.confirmEyeShow = !this.confirmEyeShow;
  }
}
