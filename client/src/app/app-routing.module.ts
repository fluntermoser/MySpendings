import { NgModule } from '@angular/core';
import { Routes, RouterModule, CanActivate  } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { OverviewComponent } from './overview/overview.component';
import { NewComponent} from './new/new.component';
import { UpdateComponent} from './update/update.component';
import { GetBookingsComponent} from './get-bookings/get-bookings.component';
import { AuthGuardService } from './auth-guard.service';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'overview',
    component: OverviewComponent,
    canActivate: [AuthGuardService],
    data: { title: 'Overview' }
  },
  {
    path: 'new',
    component: NewComponent,
    canActivate: [AuthGuardService],
    data: { title: 'NewBooking' }
  },
  {
    path: 'update/:id',
    component: UpdateComponent,
    canActivate: [AuthGuardService],
    data: { title: 'UpdateBooking' }
  },
  {
    path: 'bookings',
    component: GetBookingsComponent,
    canActivate: [AuthGuardService],
    data: { title: 'Bookings' }
  },
  {
    path: '',
    canActivate: [AuthGuardService],
    redirectTo: '/overview',
    pathMatch: 'full'
  },
  {
    path: '**',
    canActivate: [AuthGuardService],
    redirectTo: '/overview'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
