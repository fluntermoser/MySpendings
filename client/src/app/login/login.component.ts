import { Component, OnInit } from '@angular/core';
import { User } from '../user';
import { WebinterfaceService } from '../webinterface.service';
import { Router } from '@angular/router';
import { SuccessDialogComponent } from '../success-dialog/success-dialog.component';
import { MatSnackBar } from '@angular/material';
import { AuthenticationService } from '../authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
/**
 * component that provides gui to log a user in
 * @class
 */
export class LoginComponent implements OnInit {

  constructor(private webService: WebinterfaceService, private router: Router, 
    private snackBar: MatSnackBar, private authService: AuthenticationService) { }

  ngOnInit() {
  }

  model = new User('', '');

  /**
   * logs a user in on the server and stores the given webtoken if the login was successfull
   * @function
   */
  onLogin() {
    this.webService.login(this.model.username, this.model.password)
    .subscribe(token => {
      if (token.auth) {
        this.authService.authenticate(token);
        this.router.navigate(['overview']);
      }},
      error => {
        this.errorDialog();
      }
    );;
  }

  /**
   * show error message if login failed
   * @function
   */
  errorDialog() {
    this.snackBar.openFromComponent(SuccessDialogComponent, {
      duration: 2000,
      data: {
          text: 'Wrong username or password!'
      }
    });
  }

  /**
   * navigate to "Register" screen
   * @function
   */
  onSwitchToRegister() {
    this.router.navigate(['register']);
  }

}
