import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../authentication.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(private router: Router, private authService: AuthenticationService) { }

  ngOnInit() {
    $('nav button.nav-bar-button').on('click', function () {
      if($(window).width() < 1092)
        $('.navbar-toggler').click();
    });
  }

  onSignOut() {
    this.authService.revoke();
    this.router.navigate(['login']);
  }

  onNew() {
    //component and route is not yet created
    this.router.navigate(['new']);
  }

  onHome() {
    //component and route is not yet created
    this.router.navigate(['overview']);
  }

  onBookings() {
    //component and route is not yet created
    this.router.navigate(['bookings']);
  }

}
