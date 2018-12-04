import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {Router} from '@angular/router';
import {User} from '../models/user';
import {HttpClient} from '@angular/common/http';
import {RequestsService} from './requests.service';
import {environment} from '../../../environments/environment.prod';
import {AuthClaim} from '../models/authclaim';


@Injectable()
export class AuthService extends RequestsService {

  private api = environment;
  public loginBefore = null;

  public userData = new BehaviorSubject<User>(new User());
  public authenticatedChange = new BehaviorSubject(null);

  constructor(public http: HttpClient, private router: Router) {
    super(http);

    // On bootstrap or refresh, tries to get user's data.
    if (this.loggedIn()) {
      this.getUserInfo()
        .subscribe((data) => {
          this.changeUser(data);
        });
    }
  }

  /**
   * Stores access token & refresh token.
   */
  public store(data: any): void {
    this.storeAuthenticationToken(data.token);

    const info = data.info as User;
    this.changeUser(info);

  }

  /**
   * Remove token.
   */
  public removeTokens(): void {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
  }

  /**
   * Removes user and removes tokens.
   */
  public logout(): void {

    // Tells all the subscribers about the data.
    this.userData.next(new User());

    // Remove tokens.
    this.removeTokens();
    this.router.navigate(['/']);
  }

  /**
   * If user has login return true
   */
  loggedIn(): boolean {
    const authClaim = this.getAuthenticatedUser();
    if (authClaim == null) {
      return false;
    }
    const now = new Date().getTime() / 1000; // 'exp' is in seconds
    const checkLogging = authClaim.exp > now;
    if (checkLogging) {
      this.loginBefore = true; // user for expiration token
      this.authenticatedChange.next(true);
    } else {
      this.authenticatedChange.next(null);
    }
    return checkLogging;
  }

  /**
   * Tell the subscribers about the user data.
   */
  public changeUser(userInfo: User): void {
    if (userInfo == null) {
      return;
    }
    const user: User = new User();

    user.id = userInfo.id;
    user.email = userInfo.email;
    user.name = userInfo.name;
    user.username = userInfo.username;
    user.photo = userInfo.photo;

    // Tells all the subscribers about the new data.
    this.userData.next(user);
  }

  /**
   * Calls UserInfo endpoint to retrieve user's data.
   */
  public getUserInfo(): Observable<User> {
    return this.authGet(this.api.apiUrl + this.api.user.info);
  }

  /**
   * Gets authenticated user from jwt
   */
  getAuthenticatedUser() {
    let authClaim: AuthClaim;
    const jwt = this.getJwt();
    if (jwt != null) {
      const jwtArray = jwt.split('.', 3);
      authClaim = JSON.parse(atob(jwtArray[1]));
    }
    return authClaim;
  }


  /**
   * Set user Info in localStorage
   */
  storeAuthenticationToken(jwt) {
    localStorage.setItem('token', jwt);
  }
}
