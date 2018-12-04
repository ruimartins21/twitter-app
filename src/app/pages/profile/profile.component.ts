import {Component, OnInit} from '@angular/core';
import {RequestsService} from '../../core/services/requests.service';
import {environment} from '../../../environments/environment.prod';
import {AuthService} from '../../core/services/auth.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Validator} from '../../core/services/validator.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  myTweets = [];
  usersFollowing = [];
  usersFollowers = [];

  tabSelected = 'tweets';

  form: FormGroup;

  constructor(private requestsService: RequestsService, public authService: AuthService, private fb: FormBuilder) {
  }

  ngOnInit() {
    this.getUserTweets();
    this.getUserFollowing();
    this.getUserFollowers();
    this.buildForm();
  }

  /**
   * Get all user tweets
   */
  getUserTweets() {
    this.requestsService.authGet(environment.apiUrl + environment.tweets).subscribe((data) => {
      if (data) {
        this.myTweets = data.data;
      }
    });
  }

  /**
   * Get all the users that the user is following.
   */
  getUserFollowing() {
    this.requestsService.authGet(environment.apiUrl + environment.following).subscribe((data) => {
      if (data) {
        this.usersFollowing = data.data;
      }
    });
  }

  /**
   * Get all the users that the user is following.
   */
  getUserFollowers() {
    this.requestsService.authGet(environment.apiUrl + environment.followers).subscribe((data) => {
      if (data) {
        this.usersFollowers = data.data;
      }
    });
  }

  /**
   * Change tabs
   * @param tab: chosen tab
   */
  onChangeTab(tab) {
    switch (tab) {
      case 'tweets':
        this.tabSelected = 'tweets';
        break;
      case 'following':
        this.tabSelected = 'following';
        break;
      case 'followers':
        this.tabSelected = 'followers';
        break;
      case 'edit-profile':
        this.tabSelected = 'edit-profile';
        break;
    }
  }

  /**
   * Unfollow user
   * @param id: user that will be un followed
   */
  onUnfollowUser(id) {
    this.requestsService.authGet(environment.apiUrl + environment.unfollow + '/' + id).subscribe((data) => {
      if (data) {
        this.getUserFollowing();
        this.getUserFollowers();
      }
    });
  }

  /**
   * Follow users
   * @param id: of user that will be removed
   */
  onFollow(id) {
    this.requestsService.authGet(environment.apiUrl + environment.follow + '/' + id).subscribe((data) => {
      if (data) {
        this.getUserFollowing();
        this.getUserFollowers();
      }
    });
  }

  /**
   * Verify that the user id exists within my followers.
   * @param id: user id from followers
   */
  checkUser(id) {
    return this.usersFollowing.findIndex(x => x.id === id);
  }

  /**
   * Build the reactive form
   */
  buildForm() {
    this.form = this.fb.group({
      email: ['', Validators.compose([Validators.required, Validator.emailValidator])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(64), Validator.passwordValidator, Validator.noWhiteSpace])]
    });
  }
}
