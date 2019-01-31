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
export class GetBookingsComponent implements OnInit {

  constructor(private webService: WebinterfaceService, private router: Router,
    public dialog: MatDialog) {
      this.filter = new BookingFilter(null, null, null);
    }


  bookings: Booking[];
  filter: BookingFilter;

  ngOnInit() {
    this.loadBookings();
  }

  bindBookings(bookings: Booking[]) {
    bookings.forEach(b => {
      if (b.date) {
        b.dateString = new Date(b.date).toLocaleDateString();
      }
    });
    this.bookings = bookings;
  }

  loadBookings() {
    this.webService.getBookings(this.filter).subscribe(bookings => {
      console.log(bookings);
      this.bindBookings(bookings);
    });
  }

  onEdit(event) {
    if (event.target.value) {
      this.router.navigate(['update/' + event.target.value]);
    }
  }

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
        });
      }
    });
  }

  onBack() {
    this.router.navigate(['overview']);
  }

  onFilter() {
    this.loadBookings();
    console.log(this.filter);
  }

  onClearFilter() {
    this.filter = new BookingFilter(null, null, null);
    this.loadBookings();
  }
}
