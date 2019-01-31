import { Component, OnInit } from '@angular/core';
import { WebinterfaceService } from '../webinterface.service';
import { Router } from '@angular/router';
import { Booking } from '../booking';
import { SuccessDialogComponent } from '../success-dialog/success-dialog.component';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.css']
})
/**
 * component that provides a gui to create a new booking
 * @class
 */
export class NewComponent implements OnInit {

  constructor(private webService: WebinterfaceService, private router: Router,
    private snackBar: MatSnackBar) {

  }


  ngOnInit() {

  }

  model = new Booking(0,null, '', 1, 0);

  /**
   * calls the "book" function of the services with the given values from the gui
   * @function
   */
  onBook() {
    this.webService.book(this.model)
      .subscribe(() => {
        this.model = new Booking(0, null, '', 1, 0);
        this.successDialog();
      });
  }

  /**
   * show a small success dialog if the booking was saves successfully
   * @function
   */
  successDialog() {
    this.snackBar.openFromComponent(SuccessDialogComponent, {
      duration: 2000,
      data: {
          text: 'Data booked successfully!'
      }
    });
  }

  /**
   * go back to "overview" screen
   * @function
   */
  onBack() {
    this.router.navigate(['overview']);
  }
}
