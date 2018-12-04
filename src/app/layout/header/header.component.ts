import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../core/services/auth.service';
import {RequestsService} from '../../core/services/requests.service';
import {environment} from '../../../environments/environment.prod';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  private api = environment;

  constructor(public authService: AuthService, private requestsService: RequestsService) {
  }

  ngOnInit() {
  }

  /**
   * Logout of user account
   */
  public logout() {
    this.requestsService.authPost(this.api.apiUrl + this.api.user.logout);
    this.authService.logout();
  }

}
