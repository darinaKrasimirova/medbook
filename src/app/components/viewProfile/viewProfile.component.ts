import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { SharingService } from 'src/app/sharing.service';
import { Doctor } from 'src/app/models/doctor';
import { Workplace } from 'src/app/models/workplace';
import { Availability } from 'src/app/models/availability';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { HttpService } from 'src/app/http.service';

@Component({
  selector: 'app-viewProfile',
  templateUrl: './viewProfile.component.html',
  styleUrls: ['./viewProfile.component.css']
})
export class ViewProfileComponent implements OnInit {
  doctor: Doctor;
  availability: Availability[];
  datechosen = false;
  chosenDate: string;
  availableHours: string [];
  ready = false;

  constructor(private shService:SharingService, private http: HttpService, 
    private cookieService: CookieService,private router:Router, private actRoute: ActivatedRoute) {}

  async ngOnInit() {
    //this.doctor = this.shService.getDoc();
    this.actRoute.queryParams.subscribe(param=>{
      let username = param.username;
      this.http.GetDoctor(username, (data: Doctor)=>{
        this.doctor = data;
        console.log(data);
        this.http.LoadDocProfile(username, (data: Availability[])=>{
          this.ready = true;
          this.availability = data;
        });
      });  
    });
    
  }

  GetFreeHours(){
    this.http.GetFreeHours(this.chosenDate, this.doctor.username, (data)=>{
      this.datechosen = true;
      this.availableHours = data;
    });
      
  }
  BookAppointment(time, date){
    this.cookieService.set('appointmentDate', date,0.125);
    this.cookieService.set('appointmentTime', time, 0.125);
    this.cookieService.set('appointmentDoc', this.doctor.username, 0.125);
    this.cookieService.set('appointmentDocName', this.doctor.name, 0.125);
    this.cookieService.set('appointmentWorkplace', this.availability[0].workplace.name, 0.125);
    this.cookieService.set('appointmentWorkplaceId', this.availability[0].workplace.id.toString(), 0.125);
    console.log(this.doctor.name + '  '+ this.availability[0].workplace.name);
    this.router.navigateByUrl('/patient');
  }
}