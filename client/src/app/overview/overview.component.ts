import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../authentication.service';
import { WebinterfaceService } from '../webinterface.service';
import { Balance } from '../balance';
import { Router } from '@angular/router';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit {

  constructor(private webService: WebinterfaceService, private router: Router,
    private authService: AuthenticationService) { }

  ngOnInit() {
    this.webService.getBalance().subscribe(bal => {
      if(bal.balance) {
        this.balance.balance = bal.balance;
      }
    });
  }

  balance = new Balance(0);

  onLogout() {
    this.authService.revoke();
    this.router.navigate(['login']);
  }

  onAddNew() {
    //component and route is not yet created
    this.router.navigate(['new']);
  }

  onShowBookings() {
    //component and route is not yet created
    this.router.navigate(['getBookings']);
  }

  onUpdate() {
    this.router.navigate(['update']);
  }

  onDelete(){
      this.router.navigate(['delete']);
  }
}
