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

@Injectable({
  providedIn: 'root'
})
export class WebinterfaceService {

  api = "http://localhost:3000";

  constructor(private authService: AuthenticationService,
    private http: HttpClient, private router: Router) { }



  getHttpOptions() {
    let headers = new HttpHeaders().set('Content-Type', 'application/json')
      .set('x-access-token', this.authService.getToken());
    return { headers: headers };
  }

  login(username: string, password: string) {
    return this.http.post<Token>(this.api + '/login', { username, password }, this.getHttpOptions());
  }

  register(username: string, password: string) {
    return this.http.post<Token>(this.api + '/register', { username, password }, this.getHttpOptions())
      .pipe(catchError(this.handleError.bind(this))
      ).subscribe(token => {
        if (token.auth) {
          this.authService.authenticate(token);
          this.router.navigate(['overview']);
        }
      });
  }

  book(booking: Booking) {
    return this.http.post<Token>(this.api + '/book', booking, this.getHttpOptions())
      .pipe(catchError(this.handleError.bind(this))
      );
  }

  update(booking: Booking) {
    return this.http.put<Token>(this.api + '/update', booking, this.getHttpOptions())
      .pipe(catchError(this.handleError.bind(this))
      );
  }

  delete(id: number) {
    return this.http.delete<Token>(this.api + '/delete/' + id, this.getHttpOptions())
      .pipe(catchError(this.handleError.bind(this))
      );
  }

  getBooking(id: number): Observable<Booking> {
    return this.http.get<Booking>(this.api + '/get/' + id, this.getHttpOptions())
      .pipe(catchError(this.handleError.bind(this))
      );
  }

  getBookings(filter: BookingFilter): Observable<Booking[]> {
    return this.http.post<Booking[]>(this.api + '/getBookings', filter, this.getHttpOptions())
      .pipe(catchError(this.handleError.bind(this))
      );
  }

  getBalance(): Observable<Balance> {
    return this.http.get<Balance>(this.api + '/balance', this.getHttpOptions())
      .pipe(catchError(this.handleError.bind(this))
      );
  }

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
