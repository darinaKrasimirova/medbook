import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { HomeComponent} from './components/home/home.component';
import { MyProfileComponent } from './components/myProfile/myProfile.component';
import { RegisterComponent } from './components/register/register.component';
import { RegisterStep1Component } from './components/register-step1/register-step1.component';
import { RegisterStep2Component } from './components/register-step2/register-step2.component';
import { SearchResultsComponent } from './components/SearchResults/SearchResults.component';
import { ViewProfileComponent } from './components/viewProfile/viewProfile.component';
import { PatientComponent } from './components/patient/patient.component';


const routes: Routes = [
  {path : 'home',component: HomeComponent},
  {path : 'myProfile',component: MyProfileComponent},
  {path : 'register',component: RegisterComponent, children:[
    {
      path: 'step1', component: RegisterStep1Component
    }, 
    {
      path: 'step2', component: RegisterStep2Component
    }
  ]},
  {path : 'results',component: SearchResultsComponent},
  {path : 'viewProfile',component: ViewProfileComponent},
  {path : 'patient',component: PatientComponent},
  {path : 'patientRegister',component: PatientComponent},
  {path : '', redirectTo:'/home', pathMatch: 'full'},
  {path : '**', component: HomeComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
