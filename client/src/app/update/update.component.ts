import { Component, OnInit } from '@angular/core';
import { WebinterfaceService } from '../webinterface.service';
import { Booking } from '../booking';
import { MatSnackBar } from '@angular/material';
import { SuccessDialogComponent } from '../success-dialog/success-dialog.component';
import { Router, ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.css']
})
export class UpdateComponent implements OnInit {

  constructor(private webService: WebinterfaceService, 
              private router: Router,
              private datePipe: DatePipe,
              private route: ActivatedRoute,
              private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if(params['id']) {
        this.webService.getBooking(params['id']).subscribe((booking) => {
          this.model = booking;
          this.model.date =  this.datePipe.transform(new Date(this.model.date), 'yyyy-MM-dd');
        });
      }
    });
  }

  model = new Booking(0, null, '', 1, 0);

  onUpdate() {
    this.webService.update(this.model)
    .subscribe(() => {
      this.successDialog();
    });
  }

  onBack() {
    this.router.navigate(['bookings']);
  }

  successDialog() {
    this.snackBar.openFromComponent(SuccessDialogComponent, {
      duration: 2000,
      data: {
          text: 'Record successfully updated!'
      }
    });
  }

}
