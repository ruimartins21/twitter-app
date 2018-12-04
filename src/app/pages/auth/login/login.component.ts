import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Validator} from '../../../core/services/validator.service';
import {RequestsService} from '../../../core/services/requests.service';
import {environment} from '../../../../environments/environment.prod';
import {AuthService} from '../../../core/services/auth.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  private api = environment;
  private returnUrl: string;

  loginForm: FormGroup;
  errorLogin = false;

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
    this.loginForm = this.fb.group({
      email: ['', Validators.compose([Validators.required, Validator.emailValidator])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(64), Validator.passwordValidator, Validator.noWhiteSpace])]
    });
  }

  /**
   * Function responsible for making the user's login in the system.
   */
  public login() {
    this.requestsService.post(this.api.apiUrl + this.api.user.login, this.loginForm.value).subscribe(data => {
      if (typeof data.token !== 'undefined') {
        // Stores access token & refresh token.
        this.authService.store(data);
      }
      this.errorLogin = false;
      // login successful so redirect to return url
      this.router.navigateByUrl(this.returnUrl);
    }, (error: any) => {
      this.errorLogin = true;
    });
  }
}
