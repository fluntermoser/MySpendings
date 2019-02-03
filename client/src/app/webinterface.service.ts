import { Injectable } from '@angular/core';
import { AuthenticationService } from './authentication.service';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Token } from './token';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { Balance } from './balance';
import { Booking } from './booking';
import { BookingFilter } from './booking-filter';
import { Sha1 } from './sha1';
import { AppConfig } from 'src/assets/app-config';

@Injectable({
  providedIn: 'root'
})
/**
 * service that handles all communication with the server
 * @class
 */
export class WebinterfaceService {

  api = AppConfig.settings.server.location;

  constructor(private authService: AuthenticationService,
    private http: HttpClient, private router: Router) { }



  /**
   * creates a request header for every request. here the authorization token is set
   * @function
   */
  getHttpOptions() {
    let headers = new HttpHeaders().set('Content-Type', 'application/json')
      .set('x-access-token', this.authService.getToken());
    return { headers: headers };
  }

  /**
   * function to log the user into the server
   * the server returns a jwt if login was successfull
   * @function
   * @param username 
   * @param password 
   */
  login(username: string, password: string) {
    let sha1Pwd = Sha1.hash(password);
    return this.http.post<Token>(this.api + '/login', { username, password: sha1Pwd }, this.getHttpOptions());
  }

  /**
   * function to register user to the server
   * the server returns a jwt if registration was successfull
   * @param username 
   * @param password 
   */
  register(username: string, password: string) {
    let sha1Pwd = Sha1.hash(password);
    return this.http.post<Token>(this.api + '/register', { username, password: sha1Pwd }, this.getHttpOptions())
      .pipe(catchError(this.handleError.bind(this))
      ).subscribe(token => {
        if (token.auth) {
          this.authService.authenticate(token);
          this.router.navigate(['overview']);
        }
      });
  }

  /**
   * function to send a new booking to the server
   * @param booking 
   */
  book(booking: Booking) {
    return this.http.post<Token>(this.api + '/book', booking, this.getHttpOptions())
      .pipe(catchError(this.handleError.bind(this))
      );
  }

  /**
   * function to update a booking on the server
   * @param booking 
   */
  update(booking: Booking) {
    return this.http.put<Token>(this.api + '/update', booking, this.getHttpOptions())
      .pipe(catchError(this.handleError.bind(this))
      );
  }

  /**
   * function to delete a booking from the server
   * @param id 
   */
  delete(id: number) {
    return this.http.delete<Token>(this.api + '/delete/' + id, this.getHttpOptions())
      .pipe(catchError(this.handleError.bind(this))
      );
  }

  /**
   * function to get a single booking from the server by its id
   * @param id 
   */
  getBooking(id: number): Observable<Booking> {
    return this.http.get<Booking>(this.api + '/get/' + id, this.getHttpOptions())
      .pipe(catchError(this.handleError.bind(this))
      );
  }

  /**
   * function to get multiple bookings from the server that match the given filter
   * @param filter 
   */
  getBookings(filter: BookingFilter): Observable<Booking[]> {
    return this.http.post<Booking[]>(this.api + '/getBookings', filter, this.getHttpOptions())
      .pipe(catchError(this.handleError.bind(this))
      );
  }

  /**
   * function that gets the users balance from the server
   */
  getBalance(): Observable<Balance> {
    return this.http.get<Balance>(this.api + '/balance', this.getHttpOptions())
      .pipe(catchError(this.handleError.bind(this))
      );
  }

  /**
   * function to handle errors that where returned by the server
   * this function is uses by every request for basic error handling
   * @param error 
   */
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      if (error.error.message) {
        if (error.error.auth === false) {
          this.authService.revoke();
          this.router.navigate(['login']);
        }
        alert(error.error.message);
      } else {
        alert(error.error);
      }

      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  };
}


