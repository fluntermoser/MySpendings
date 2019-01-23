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
export class LoginComponent implements OnInit {

  constructor(private webService: WebinterfaceService, private router: Router, 
    private snackBar: MatSnackBar, private authService: AuthenticationService) { }

  ngOnInit() {
  }

  model = new User('', '');

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

  errorDialog() {
    this.snackBar.openFromComponent(SuccessDialogComponent, {
      duration: 2000,
      data: {
          text: 'Wrong username or password!'
      }
    });
  }

  onSwitchToRegister() {
    this.router.navigate(['register']);
  }

}
