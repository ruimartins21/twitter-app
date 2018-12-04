import {Injectable} from '@angular/core';
import {AbstractControl} from '@angular/forms';

const EMAIL_REGEX: RegExp = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;

interface ValidationResult {
  [key: string]: boolean;
}

@Injectable()
export class Validator {
  static emailValidator(control: AbstractControl): ValidationResult {
    return EMAIL_REGEX.test(control.value) ? null : {'invalidEmailAddress': true};
  }

  static noWhiteSpace(control: AbstractControl): ValidationResult {
    return (!!control.value && control.value.trim() !== '') ? null : {'noWhiteSpace': true};
  }

  static passwordValidator(control: AbstractControl): ValidationResult {
    // [^ ]* - Assert password has no spaces
    return control.value.match(/^[^ ]*$/) ? null : {'invalidPassword': true};
  }

  static passwordMatchValidator(g: AbstractControl) {
    return g.get('password').value === g.get('password_confirmation').value ? null : {
      mismatch: {
        valid: false
      }
    };
  }
}
