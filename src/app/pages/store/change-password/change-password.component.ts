// external
import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';

// internal
import { Constants, URL_ROUTES } from '@constant/constants';

import { ValidationService } from '@services/validation.service';
import { FormService } from '@services/form.service';
import { AuthenticationService } from '@services/auth.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
})
export class ChangePasswordComponent implements OnInit {
  public changePasswordForm: FormGroup;
  public eyeShow = false;
  public confirmEyeShow = false;
  public currentEyeShow = false;
  public messageList: any = {
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  };

  constructor(
    private formService: FormService,
    public translation: TranslateService,
    private fb: FormBuilder,
    public validationService: ValidationService,
    public authService: AuthenticationService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.initializeChangePasswordForm();
    this.initializeMessages();
  }

  initializeChangePasswordForm() {
    this.changePasswordForm = this.fb.group(
      {
        oldPassword: new FormControl(null, [
          Validators.required,
          Validators.minLength(Constants.PASSWORD_MIN_LENGTH),
          Validators.maxLength(Constants.PASSWORD_MAX_LENGTH),
        ]),
        newPassword: new FormControl(null, [
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
          'newPassword',
          'confirmPassword',
        ),
      },
    );
  }

  initializeMessages() {
    this.messageList.oldPassword = {
      required: this.translation.instant('changePassword.oldPasswordRequired'),
      minlength: this.translation.instant(
        'changePassword.oldPasswordMinLength',
      ),
      maxlength: this.translation.instant(
        'changePassword.oldPasswordMaxLength',
      ),
    };
    this.messageList.newPassword = {
      pattern: this.translation.instant('changePassword.newPasswordInvalid'),
      required: this.translation.instant('changePassword.newPasswordRequired'),
      minlength: this.translation.instant(
        'changePassword.newPasswordMinLength',
      ),
      maxlength: this.translation.instant(
        'changePassword.newPasswordMaxLength',
      ),
    };
    this.messageList.confirmPassword = {
      required: this.translation.instant(
        'changePassword.confirmPasswordRequired',
      ),
      minlength: this.translation.instant(
        'changePassword.confirmPasswordMinLength',
      ),
      maxlength: this.translation.instant(
        'changePassword.confirmPasswordMaxLength',
      ),
      confirmedValidator: this.translation.instant(
        'changePassword.passwordConfirmPasswordNotMatch',
      ),
    };
  }

  onSubmit() {
    this.formService.markFormGroupTouched(this.changePasswordForm);
    if (this.changePasswordForm.invalid) {
      return;
    }
    const changePasswordData = {
      oldPassword: this.changePasswordForm.value.oldPassword,
      newPassword: this.changePasswordForm.value.newPassword,
    };
    this.authService.changePasswordData(changePasswordData).then((res) => {
      this.router.navigate([`${URL_ROUTES.STORE_HOME}`]);
    });
  }

  onToggleEyeShow() {
    this.eyeShow = !this.eyeShow;
  }

  onToggleEyeShowConfirm() {
    this.confirmEyeShow = !this.confirmEyeShow;
  }
  onToggleCurentEyeShowConfirm() {
    this.currentEyeShow = !this.currentEyeShow;
  }
}
