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
export class NewComponent implements OnInit {

  constructor(private webService: WebinterfaceService, private router: Router,
    private snackBar: MatSnackBar) {

  }


  ngOnInit() {

  }

  model = new Booking(0,null, '', 1, 0);

  onBook() {
    this.webService.book(this.model)
      .subscribe(() => {
        this.model = new Booking(0, null, '', 1, 0);
        this.successDialog();
      });
  }

  successDialog() {
    this.snackBar.openFromComponent(SuccessDialogComponent, {
      duration: 2000,
      data: {
          text: 'Data booked successfully!'
      }
    });
  }

  onBack() {
    this.router.navigate(['overview']);
  }
}
