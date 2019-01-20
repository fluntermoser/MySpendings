import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor() { }

  isAuthenticated() {
    let token = this.getToken();
    if (token) return true;
    return false;
  }

  authenticate(token) {
    sessionStorage.setItem('auth-token', token.token);
  }

  revoke() {
    sessionStorage.removeItem('auth-token');
  }

  getToken() {
    let token = sessionStorage.getItem('auth-token');
    if(token) return token;
    return '';
  }
}
