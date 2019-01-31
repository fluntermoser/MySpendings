import { Component, OnInit } from '@angular/core';
import { WebinterfaceService } from '../webinterface.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
/**
 * component that shows a short welcome message and the users current account balance
 * also provides buttons to go to "New Booking" and "All Bookings" screen
 * @class
 */
export class OverviewComponent implements OnInit {

  constructor(private webService: WebinterfaceService, private router: Router) { }

  ngOnInit() {
    //get the users balance from server and bind it to the balance variable of this site
    this.webService.getBalance().subscribe(bal => {
      if(bal.balance) {
        this.balance = bal.balance;
      }
    });
  }

  balance: number = 0;

  /**
   * go to "New Booking" screen
   * @function
   */
  onAddNew() {
    this.router.navigate(['new']);
  }

  /**
   * go to "All Bookings" screen
   * @function
   */
  onShowBookings() {
    this.router.navigate(['bookings']);
  }
}
