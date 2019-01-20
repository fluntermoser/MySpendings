import { Component, OnInit } from '@angular/core';
import { User } from '../user';
import { WebinterfaceService } from '../webinterface.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private webService: WebinterfaceService, private router: Router) { }

  ngOnInit() {
  }

  model = new User('', '');

  onLogin() {
    this.webService.login(this.model.username, this.model.password);
  }

  onSwitchToRegister() {
    this.router.navigate(['register']);
  }

}
