import { Component, OnInit } from '@angular/core';
import { WebinterfaceService } from '../webinterface.service';
import { Booking } from '../booking';

@Component({
  selector: 'app-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.css']
})
export class DeleteComponent implements OnInit {

  constructor(private webService: WebinterfaceService) { }

  ngOnInit() {
  }

  booking = new Booking(0,'','',0,0);

  async onDelete() {

    await this.webService.delete(this.booking.id);
  
    this.booking.id=0;
    this.booking.date="01.01.2019";
    this.booking.text="";
    this.booking.amount=0;
  }
}
