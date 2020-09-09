import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule }   from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component'
import { MyProfileComponent } from './components/myProfile/myProfile.component';
import { RegisterComponent } from './components/register/register.component';
import { RegisterStep1Component } from './components/register-step1/register-step1.component';
import { RegisterStep2Component } from './components/register-step2/register-step2.component';
import { SearchResultsComponent } from './components/SearchResults/SearchResults.component';
import { ViewProfileComponent } from './components/viewProfile/viewProfile.component';
import { PatientComponent } from './components/patient/patient.component';
import { SharingService } from './sharing.service';
import { CookieService } from 'ngx-cookie-service';
import { HttpService } from './http.service';


@NgModule({
  declarations: [
    AppComponent, 
    HomeComponent,
    MyProfileComponent,
    RegisterComponent,
    RegisterStep1Component,
    RegisterStep2Component,
    SearchResultsComponent,
    ViewProfileComponent,
    PatientComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule, 
    FormsModule,
    HttpClientModule
  ],
  providers: [
    SharingService,
    CookieService,
    HttpService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
