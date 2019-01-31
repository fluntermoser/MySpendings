import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../authentication.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
/**
 * component that is displayed on every screen at the very top of the window#
 * provides navigation to all functions
 * @class
 */
export class NavbarComponent implements OnInit {

  constructor(private router: Router, private authService: AuthenticationService) { }

  ngOnInit() {
    //close the mobile menu if a navigation button was clicked
    $('nav button.nav-bar-button').on('click', function () {
      if($(window).width() < 1092)
        $('.navbar-toggler').click();
    });
  }

  /**
   * sign the user out and navigate to the login screen
   * @function
   */
  onSignOut() {
    this.authService.revoke();
    this.router.navigate(['login']);
  }

  /**
   * navigate to "New Booking" screen
   * @function
   */
  onNew() {
    this.router.navigate(['new']);
  }

  /**
   * navigate to "Overview" screen
   * @function
   */
  onHome() {
    this.router.navigate(['overview']);
  }

  /**
   * navigate to "All Bookings" screen
   * @function
   */
  onBookings() {
    //component and route is not yet created
    this.router.navigate(['bookings']);
  }

}
