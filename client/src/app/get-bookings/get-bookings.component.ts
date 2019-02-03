import { Component, OnInit } from '@angular/core';
import { WebinterfaceService } from '../webinterface.service';
import { Router } from '@angular/router';
import { Booking } from '../booking';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { BookingFilter } from '../booking-filter';

@Component({
  selector: 'app-get-bookings',
  templateUrl: './get-bookings.component.html',
  styleUrls: ['./get-bookings.component.css']
})
/**
 * component that lists all bookings of a user and allows the user to filter their bookings
 * @class
 */
export class GetBookingsComponent implements OnInit {

  constructor(private webService: WebinterfaceService, private router: Router,
    public dialog: MatDialog) {
    this.filter = new BookingFilter(null, this.getFirstDay(), this.getLastDay());
  }



  bookings: Booking[];
  filter: BookingFilter;
  sum: number = 0;
  balance: number;

  ngOnInit() {
    //load bookings right after the user opened the page
    this.loadBookings();
    this.loadBalance();
  }

  /**
   * loads all bookings of the user from the server
   * @function
   */
  loadBookings() {
    this.webService.getBookings(this.filter).subscribe(bookings => {
      console.log(bookings);
      this.bindBookings(bookings);
    });
  }

  loadBalance() {
    this.webService.getBalance().subscribe(bal => {
      if(bal.balance) {
        this.balance = bal.balance;
      }
    });
  }

  /**
   * binds all bookings that where returned by the server to the bookings object of this page
   * @function
   * @param bookings 
   */
  bindBookings(bookings: Booking[]) {
    this.sum = 0;
    bookings.forEach(b => {
      if(b.type === 0) {
        this.sum -= b.amount;
      } else {
        this.sum += b.amount;
      }
      if (b.date) {
        b.dateString = new Date(b.date).toLocaleDateString();
      }
    });
    this.bookings = bookings;
  }

  /**
   * navigates to the "Edit" screen and sets the id of the booking that was selected to the url
   * @function
   * @param event -button event triggered by the click of the user
   */
  onEdit(event) {
    if (event.target.value) {
      this.router.navigate(['update/' + event.target.value]);
    }
  }

  /**
   * opens a dialog that asks the user if they want to delete the selected booking;
   * deletes booking if yes was hit in the dialog
   * @function
   * @param event -button event triggered by the click of the user
   */
  onDelete(event) {
    if (!event.target.value) {
      return;
    }
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: { title: 'Delete?', content: 'Are you sure you want to delete this record?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.webService.delete(event.target.value).subscribe(() => {
          this.loadBookings();
          this.loadBalance();
        });
      }
    });
  }

  /**
   * navigates back to "overview" screen
   * @function
   */
  onBack() {
    this.router.navigate(['overview']);
  }

  /**
   * filters the bookings of the user according to the given filter parameters
   * @function
   */
  onFilter() {
    this.loadBookings();
    console.log(this.filter);
  }

  /**
   * clears the filter and loads all bookings from server
   * @function
   */
  onClearFilter() {
    this.filter = new BookingFilter(null, null, null);
    this.loadBookings();
  }

  /**
   * gets first day of month as string
   * @function
   */
  private getLastDay() {
    let date = new Date();
    let lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    return this.getDateString(lastDay);
  }

  /**
   * gets last day of month as string
   * @function
   */
  private getFirstDay() {
    let date = new Date();
    let firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    return this.getDateString(firstDay);
  }

  /**
   * returns date as string as "YYYY-MM-DD"
   * @function
   */
  private getDateString(date) {
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();

    if(month < 10) {
      month = `0${month}`;
    }

    if(day < 10) {
      day = `0${day}`;
    }

    return `${year}-${month}-${day}`;
  }
}
