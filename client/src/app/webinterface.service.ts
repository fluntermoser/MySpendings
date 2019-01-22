import { Injectable } from '@angular/core';
import { AuthenticationService } from './authentication.service';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { User } from './user';
import { Token } from './token';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { Balance } from './balance';
import { Booking } from './booking';

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
    return {headers: headers};
  }

  login(username: string, password: string) {
    return this.http.post<Token>(this.api + '/login', { username, password }, this.getHttpOptions())
      .pipe(catchError(this.handleError)
      ).subscribe(token => {
        if (token.auth) {
          this.authService.authenticate(token);
          this.router.navigate(['overview']);
        }
      });
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

 book(date: string, text: string, amount: number, type: number) {
    return this.http.post<Token>(this.api + '/book', { date, text, amount, type }, this.getHttpOptions())
      .pipe(catchError(this.handleError.bind(this))
      ).subscribe(token => {
        if (token.auth) {
          this.authService.authenticate(token);
          this.router.navigate(['new']);
        }
      });
  }

  update(id: number, date: string, text: string, amount: number, type: number) {
    return this.http.post<Token>(this.api + '/update', { id, date, text, amount, type }, this.getHttpOptions())
      .pipe(catchError(this.handleError.bind(this))
      ).subscribe(token => {
        if (token.auth) {
          this.authService.authenticate(token);
          this.router.navigate(['update']);
        }
      });
  }

  delete(id: number) {
    return this.http.post<Token>(this.api + '/update', { id }, this.getHttpOptions())
      .pipe(catchError(this.handleError.bind(this))
      ).subscribe(token => {
        if (token.auth) {
          this.authService.authenticate(token);
          this.router.navigate(['delete']);
        }
      });
  }

  getBookings(dateFrom: string, dateTo: string, type: number): Observable<Booking> {
    return this.http.post<Booking>(this.api + '/get', { dateFrom, dateTo, type }, this.getHttpOptions())
      .pipe(catchError(this.handleError.bind(this))
      );
  }
  

  getBalance(): Observable<Balance> {
    return this.http.post<Balance>(this.api + '/balance',{}, this.getHttpOptions())
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
      if(error.error.message) {
        if(error.error.auth === false) {
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
