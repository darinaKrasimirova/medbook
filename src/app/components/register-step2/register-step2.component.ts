import { Component, OnInit, Input } from '@angular/core';
import { Doctor } from '../../models/doctor';
import { Availability } from '../../models/availability';
import { Workplace } from '../../models/workplace';
import { WeekDay } from '@angular/common';
import { HttpParams, HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { HttpService } from 'src/app/http.service';
import { CookieService } from 'ngx-cookie-service';
import { FormControl, NgModel } from '@angular/forms';
import { NgForm } from '@angular/forms';


@Component({
  selector: 'app-register-step2',
  templateUrl: './register-step2.component.html',
  styleUrls: ['./register-step2.component.css']
})
export class RegisterStep2Component implements OnInit {
  days = ["Monday","Tuesday","Wednesday", "Thursday","Friday","Saturday","Sunday"];
  availability= new Array<Availability>(7);
  workplace = new Workplace();
  disabled = false;
  @Input() doctor:Doctor;  

  constructor(private http: HttpService,private route: Router, public cookieService: CookieService) { }

  ngOnInit() {
      for(let j = 0; j<this.availability.length; j++){
        this.availability[j] = new Availability();
        this.availability[j].day = this.days[j];
        this.availability[j].from_h = "";
        this.availability[j].to_h = "";
      }
      // this.workplace.city = this.doctor.city;
      if(this.cookieService.check('edit')){
        this.http.LoadDocProfile(this.doctor.username, (data: Availability[])=>{
          console.log(data);
          for(let i = 0; i<data.length; i++){
            switch(data[i].day){
              case this.days[0]: this.availability[0] = data[i]; break;
              case this.days[1]: this.availability[1] = data[i]; break;
              case this.days[2]: this.availability[2] = data[i]; break;
              case this.days[3]: this.availability[3] = data[i]; break;
              case this.days[4]: this.availability[4] = data[i]; break;
              case this.days[5]: this.availability[5] = data[i]; break;
              case this.days[6]: this.availability[6] = data[i]; break;
            }
            console.log(data[i].day + data[i].from_h);
          }
          this.workplace = data[0].workplace;
          console.log(data[0].workplace);
        });
      }
    
  }
  Submit(form:NgForm){
    /*for(let i=0; i<this.days.length; i++){
      console.log(this.availability[i]);
    }

    for(let i=this.days.length-1; i!=0; i--){
      if(!(<HTMLInputElement>document.getElementById(this.days[i])).checked){
        this.availability.splice(i,1);
      }
    }*/
    if(this.cookieService.check('edit')){
      if(this.cookieService.check('docChanged')){
        this.http.UpdateDoctor(this.doctor, (data)=>{});
      }
      if(form.controls["workplace.name"].dirty||form.controls["workplace.address"].dirty){
        this.http.UpdateWorkplace(this.workplace.name, this.workplace.address, this.doctor.city, this.doctor.username, (data)=>{});
      }else if(form.dirty){
        console.log(this.availability.filter((a)=>{return(a.from_h!=="" && a.to_h!=="") }));
        this.http.UpdateAvailability(this.doctor.username, this.availability.filter((a)=>{return(a.from_h!=="" && a.to_h!=="") }),(data)=>{} );
      } 
      this.cookieService.delete('edit');
      this.cookieService.deleteAll();
      console.log(this.cookieService.getAll());
      alert('Profile updated');
      this.route.navigateByUrl('/myProfile');
    }
    else {
      this.disabled = true;
      this.http.SubmitRegistration(this.doctor, this.workplace, this.availability.filter((a, i,availability)=>{return(a.from_h!=="" && a.to_h!=="") }), ()=>{
      alert('You registered successfully!');
      //waits(1000);
      this.route.navigateByUrl('/home');
    });
    }

    

  }

}
