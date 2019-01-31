import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

/**
 * serive that manages the jwt the server returned after a successfull login or registration.
 * as long as there is a token in the sessionStorage, the application consideres itself logged in.
 * if the server returns "not authenticated" the token is removed from the session storage
 * @class
 */
export class AuthenticationService {

  constructor() { }

  /**
   * checks if there is a jwt in sessionStorage
   */
  isAuthenticated() {
    let token = this.getToken();
    if (token) return true;
    return false;
  }

  /**
   * writes the given jwt to sessionStorage
   * @param token 
   */
  authenticate(token) {
    sessionStorage.setItem('auth-token', token.token);
  }

  /**
   * removes the jwt from sessionStorage
   */
  revoke() {
    sessionStorage.removeItem('auth-token');
  }

  /**
   * gets the token from sessionStorage; returns an empty string if no token is found
   */
  getToken() {
    let token = sessionStorage.getItem('auth-token');
    if(token) return token;
    return '';
  }
}
