import { Component, OnInit } from '@angular/core';
import { WebinterfaceService } from '../webinterface.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit {

  constructor(private webService: WebinterfaceService, private router: Router) { }

  ngOnInit() {
    this.webService.getBalance().subscribe(bal => {
      if(bal.balance) {
        this.balance = bal.balance;
      }
    });
  }

  balance: number = 0;

  onAddNew() {
    this.router.navigate(['new']);
  }

  onShowBookings() {
    this.router.navigate(['bookings']);
  }
}
