import { Component, OnInit } from '@angular/core';
import { WebinterfaceService } from '../webinterface.service';
import { Router } from '@angular/router';
import { User } from '../user';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(private webService: WebinterfaceService, private router: Router) { }

  ngOnInit() {
  }
  model = new User('','');

  onRegister() {
    if(this.model.password !== this.model.password2) {
      alert('Passwords do not match');
      return;
    }
    this.webService.register(this.model.username, this.model.password);
  }

  onBack() {
    this.router.navigate(['login']);
  }

}
