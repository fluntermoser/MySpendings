import { Component, OnInit } from '@angular/core';
import { WebinterfaceService } from '../webinterface.service';
import { Router } from '@angular/router';
import { User } from '../user';
import { MatSnackBar } from '@angular/material';
import { SuccessDialogComponent } from '../success-dialog/success-dialog.component';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
/**
 * component that provides a gui for the registration process of user
 * calls webinterfaceService
 * @class
 */
export class RegisterComponent implements OnInit {

  constructor(private webService: WebinterfaceService, private router: Router,
    private snackBar: MatSnackBar) { }

  ngOnInit() {
  }
  model = new User('','');

  /**
   * if the given passwords match, the register function from the service is called
   * @function
   */
  onRegister() {
    if(this.model.password !== this.model.password2) {
      this.errorDialog();
      return;
    }
    this.webService.register(this.model.username, this.model.password);
  }

  /**
   * show an error message if the given passowrds do not match
   * @function
   */
  errorDialog() {
    this.snackBar.openFromComponent(SuccessDialogComponent, {
      duration: 2000,
      data: {
          text: 'Passwords do not match!'
      }
    });
  }

  /**
   * go back to the login screen
   * @function
   */
  onBack() {
    this.router.navigate(['login']);
  }

}
