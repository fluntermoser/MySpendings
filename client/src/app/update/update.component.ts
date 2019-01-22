import { Component, OnInit } from '@angular/core';
import { WebinterfaceService } from '../webinterface.service';
import { Booking } from '../booking';

@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.css']
})
export class UpdateComponent implements OnInit {

  constructor(private webService: WebinterfaceService) { }

  ngOnInit() {
  }

  booking = new Booking(0,'','',0,0);

  async onUpdate() {
    if(this.booking.amount>0){
      this.booking.type = 1;
    } else {
      this.booking.type = 0;
    }

    await this.webService.update(this.booking.id,this.booking.date,this.booking.text,this.booking.amount,this.booking.type);
  
    this.booking.id=0;
    this.booking.date="01.01.2019";
    this.booking.text="";
    this.booking.amount=0;
  }

}
