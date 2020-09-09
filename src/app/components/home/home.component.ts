import { Component, OnInit } from '@angular/core';
import { Cities } from 'src/app/models/cities.enum';
import { MedicalFields } from 'src/app/models/medicalFields.enum';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { Doctor } from 'src/app/models/doctor';
import { SharingService } from 'src/app/sharing.service'
import { Router } from '@angular/router';
import { HttpService } from 'src/app/http.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})


export class HomeComponent implements OnInit {
  cities = Cities;
  medicalFields = MedicalFields;
  field: string;
  city: string;
  name: string;
  results: Doctor[];
  clicked = false;
  username: string;
  password: string;

  constructor(private http: HttpService, private shService: SharingService ,
    private router:Router, private cookieService: CookieService) { }

  ngOnInit() { }

  SearchByFields(){
    this.clicked = true;
    //this.shService.setSearchingParams({name:"", field: this.field, city: this.city});
    this.http.SearchByFields(this.field,this.city, (data: Doctor[])=>{
      //this.shService.setDoctorResults(data);
      this.cookieService.set('searchParamField',this.field, 1);
      this.cookieService.set('searchParamCity', this.city, 1);
      this.cookieService.delete('searchParamName');
      this.router.navigateByUrl('/results');
    } )
  }

  SearchByName(){
    this.clicked = true;
    //this.shService.setSearchingParams({name: this.name, field:"", city:""} );
    this.http.SearchByName(this.name, (data: Doctor[])=>{
      //this.shService.setDoctorResults(data);
      this.cookieService.set('searchParamName', this.name, 1);
      this.cookieService.delete('searchParamField');
      this.cookieService.delete('searchParamCity');
      this.router.navigateByUrl('/results');
    });
  }

  LogIn(){
    let label = document.getElementById('logInNote');

    this.http.LogIn(this.username,  this.password, (data: Doctor[])=>{
      if(data){
        //this.shService.setDoctor(data[0]);
        this.cookieService.set('loggedInUsername',this.username, 1);
        this.cookieService.set('loggedInPassword',this.password, 1);
        console.log(this.cookieService.getAll());
        console.log(data);
        this.router.navigateByUrl('/myProfile');
      }
      else {
        label.innerText = 'Invalid username or paswoord';
      }
    });
  }
  
}
