import {Component, OnInit} from '@angular/core';
import {environment} from '../../../environments/environment.prod';
import {RequestsService} from '../../core/services/requests.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../core/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  results = [];
  users = [];

  form: FormGroup;

  constructor(private requestsService: RequestsService, private fb: FormBuilder, public authService: AuthService) {
  }

  ngOnInit() {
    if (this.authService.loggedIn()) {
      this.getTimeline();
      this.getUsers();
      this.buildForm();
    }
  }

  /**
   * Get timeline tweets
   */
  getTimeline() {
    this.requestsService.authGet(environment.apiUrl + environment.timeline).subscribe((data) => {
      if (data) {
        this.results = data.data;
      }
    });
  }

  /**
   * Get all possible users to be followed.
   */
  getUsers() {
    this.requestsService.authGet(environment.apiUrl + environment.users).subscribe((data) => {
      if (data) {
        this.users = data.data;
      }
    });
  }

  /**
   * Follow users
   * @param id: of user that will be removed
   * @param index: of user object in array
   */
  onFollow(id, index) {
    this.requestsService.authGet(environment.apiUrl + environment.follow + '/' + id).subscribe((data) => {
      if (data) {
        this.users.splice(index, 1);
      }
    });
  }

  /**
   * Build the reactive form
   */
  buildForm() {
    this.form = this.fb.group({
      body: ['', Validators.compose([Validators.required])],
    });
  }

  /**
   * Make a new user tweet
   */
  onSubmit() {
    this.requestsService.authPost(environment.apiUrl + environment.tweet, this.form.value).subscribe((data) => {
      if (data) {
        this.form.reset();
      }
    });
  }
}
