import {Component, OnInit} from '@angular/core';
import {environment} from '../../../../environments/environment.prod';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {RequestsService} from '../../../core/services/requests.service';
import {AuthService} from '../../../core/services/auth.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Validator} from '../../../core/services/validator.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  private api = environment;
  private returnUrl: string;

  registerForm: FormGroup;
  error = {
    email: null,
    username: null
  };

  constructor(private fb: FormBuilder, private requestsService: RequestsService, private authService: AuthService, private router: Router, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    this.buildForm();
  }

  /**
   * Build the reactive forms
   */
  buildForm() {
    this.registerForm = this.fb.group({
      name: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(32)])],
      username: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(32)])],
      email: ['', Validators.compose([Validators.required, Validator.emailValidator])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(64), Validator.passwordValidator])],
      password_confirmation: ['', Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(64)])],
    }, {validator: Validator.passwordMatchValidator});
  }

  /**
   * Register a user
   */
  register() {
    this.requestsService.post(this.api.apiUrl + this.api.user.register, this.registerForm.value).subscribe(data => {
      if (data) {
        if (typeof data.token !== 'undefined') {
          // Stores access token & refresh token.
          this.authService.store(data);
        }
        this.error = null;
        // login successful so redirect to return url
        this.router.navigateByUrl(this.returnUrl);
      }
    }, err => {
      this.error = err.error.errors;
    });
  }


}
