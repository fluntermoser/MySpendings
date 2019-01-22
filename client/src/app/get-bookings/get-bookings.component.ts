import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../authentication.service';
import { WebinterfaceService } from '../webinterface.service';
import { Router } from '@angular/router';
import { Booking } from '../booking';

@Component({
  selector: 'app-get-bookings',
  templateUrl: './get-bookings.component.html',
  styleUrls: ['./get-bookings.component.css']
})
export class GetBookingsComponent implements OnInit {

  constructor(private webService: WebinterfaceService) { }

  ngOnInit() {
  }

booking: Booking[];

onShowAll(){
  //this.booking.push(this.webService.getBookings("2019-01-01","2019-12-31",1));

}

}
