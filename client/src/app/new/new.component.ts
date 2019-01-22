import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../authentication.service';
import { WebinterfaceService } from '../webinterface.service';
import { Router } from '@angular/router';
import { text } from '@angular/core/src/render3';
import { Booking } from '../booking';

@Component({
  selector: 'app-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.css']
})
export class NewComponent implements OnInit {

  constructor(private webService: WebinterfaceService, private router: Router,
    private authService: AuthenticationService) { }
 

  ngOnInit() {
  
  }

 booking = new Booking(0,'','',0,0);

  async onBooking(){
    if(this.booking.amount>0){
      this.booking.type = 1;
    } else {
      this.booking.type = 0;
    }
   await this.webService.book(this.booking.date,this.booking.text,this.booking.amount,this.booking.type);
  
   this.booking.date="01.01.2019";
   this.booking.text="";
   this.booking.amount=0;
  }

}
