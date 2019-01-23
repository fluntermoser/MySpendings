import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { OverviewComponent } from './overview/overview.component';
import { HttpClientModule } from '@angular/common/http';
import { NewComponent } from './new/new.component';
import { UpdateComponent } from './update/update.component';
import { GetBookingsComponent } from './get-bookings/get-bookings.component';
import { SuccessDialogComponent } from './success-dialog/success-dialog.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBarModule } from '@angular/material';
import {MatDialogModule} from '@angular/material';
import { DatePipe } from '@angular/common';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { NavbarComponent } from './navbar/navbar.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    OverviewComponent,
    NewComponent,
    UpdateComponent,
    GetBookingsComponent,
    SuccessDialogComponent,
    ConfirmationDialogComponent,
    NavbarComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
  BrowserAnimationsModule,
    MatSnackBarModule,
    MatDialogModule,
    FormsModule
  ],
  entryComponents: [
    SuccessDialogComponent,
    ConfirmationDialogComponent,
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
