import { Component, OnInit } from '@angular/core';
import { SharingService } from 'src/app/sharing.service'
import { Doctor } from 'src/app/models/doctor';
import { Router } from '@angular/router';
import { Cities } from '../../models/cities.enum';
import { MedicalFields } from '../../models/medicalFields.enum';
import { CookieService } from 'ngx-cookie-service';
import { HttpService } from 'src/app/http.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-searchResults',
  templateUrl: './searchResults.component.html',
  styleUrls: ['./searchResults.component.css']
})
export class SearchResultsComponent implements OnInit {
  docs : Doctor[];
  searchParams = {name:"", field:"", city:""};
  fields = MedicalFields;
  cities = Cities;
  constructor(private shService:SharingService, private route: Router,
     private cookieService: CookieService, private http: HttpService) { }
  
  ngOnInit() {
    //this.docs = this.shService.getDoctorResults();
    //this.searchParams = this.shService.getSeachingParams();
    
    
    if (this.cookieService.check('searchParamName')){
      this.searchParams.name = this.cookieService.get('searchParamName');
      this.http.SearchByName(this.searchParams.name,(data)=>{
        this.docs = data;
        this.cookieService.set('searchParamName', this.searchParams.name, 1);
      });
    }else if( this.cookieService.check('searchParamField')&& this.cookieService.check('searchParamCity')){
      this.searchParams.field = this.cookieService.get('searchParamField');
      this.searchParams.city = this.cookieService.get('searchParamCity');
      this.http.SearchByFields( this.searchParams.field,  this.searchParams.city, (data)=>{
        this.docs = data;
        this.cookieService.set('searchParamField', this.searchParams.field, 1);
        this.cookieService.set('searchParamCity', this.searchParams.city, 1);
      })
    }else this.route.navigateByUrl('/home');
  }

  GoToProfile(doc: Doctor){
    this.route.navigateByUrl('/viewProfile?username='+doc.username);
  }

}
