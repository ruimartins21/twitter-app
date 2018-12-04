import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RequestsService {

  constructor(public http: HttpClient) {
  }

  public getJwt(): string {
    let jwt = localStorage.getItem('token');
    if (jwt === null) {
      jwt = sessionStorage.getItem('token');
    }
    return jwt;
  }

  /**
   * Gets requests options for use in auth requests
   */
  public getRequestOptions() {
    const jwt = this.getJwt();
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json', 'Authorization': 'Bearer ' + jwt
      })
    };
  }

  /**
   * Creates a authPost request to the specified Url with the specified body and parameters.
   * This method needs the token every time. This reason for the call getRequestOptions()
   * @param url the Url of the request
   * @param body body of the post request
   */
  public authPost(url: string, body?: any): Observable<any> {
    return this.http.post(url, body, this.getRequestOptions());

  }

  /**
   * Creates a Post request to the specified Url with the specified body and parameters without authentication.
   * @param url the Url of the request
   * @param body body of the post request
   */
  public post(url: string, body: any): Observable<any> {
    return this.http.post(url, body);
  }

  /**
   * Creates a get request to the specified url and specified parameters.
   * The response is checked for errors, if there
   * are no errors the result is returned.
   * @param url the url of the request
   */
  public get(url: string): Observable<any> {
    return this.http.get(url)
      .pipe(catchError(this.handleError));
  }

  /**
   * Creates a get auth request to the specified url and specified parameters.
   * This method needs the token every time. This reason for the call getRequestOptions()
   * The response is checked for errors, if there
   * are no errors the result is returned.
   * @param url the url of the request
   */
  public authGet(url: string): Observable<any> {
    return this.http.get(url, this.getRequestOptions())
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(`Backend returned code ${error.status}, ` + `body was: ${error.error}`);
    }
    // return an ErrorObservable with a user-facing error message
    return throwError('Something bad happened; please try again later.');
  }
}
