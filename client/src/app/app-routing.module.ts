import { NgModule } from '@angular/core';
import { Routes, RouterModule, CanActivate  } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { OverviewComponent } from './overview/overview.component';
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
