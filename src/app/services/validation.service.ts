import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
@Injectable({
  providedIn: 'root'
})
export class ValidationService {

  constructor() { }

  /**
   * usernameAsEmailValidator(control) = check user name as email valid or not (left & right space except)
   * @param control in form control
   */
  static usernameAsEmailValidator(control) {
    if (control.value.match(/\s*(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)\s*$)/g)) {
      return null;
    } else {
      return { invalidEmailAddress: true };
    }
  }

  /**
   * emailValidator(control) => check email valid or not (left & right space not except)
   * @param control in form control
   */
  static emailValidator(control) {
    if (control.value.match(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/g)) {
      return null;
    } else {
      return { invalidEmailAddress: true };
    }
  }

  /**
   * mobileNumberValidator(control) => check mobile number valid or not
   * @param control in form control
   */
  static mobileNumberValidator(control) {
    if (control.value.match(/^([0-9]{10,15})$/)) {
      return null;
    } else {
      return { invalidMobileNumber: true };
    }
  }

  /**
   * webUrlValidator(control) => check website url valid or not
   * @param control in form control
   */
  static webUrlValidator(control) {
    if (control.value.match(/^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/)) {
      return null;
    } else {
      return { invalidWebUrl: true };
    }
  }

  confirmedValidator(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];
      if (matchingControl.errors && !matchingControl.errors.confirmedValidator) {
        return;
      }
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ confirmedValidator: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }
}
