import { Component, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Cities } from 'src/app/models/cities.enum';
import { MedicalFields } from 'src/app/models/medicalFields.enum';
import { Doctor } from '../../models/doctor';
//import { EventEmitter } from 'protractor';
import { EventEmitter } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { HttpService } from 'src/app/http.service';
import * as _ from 'lodash';
import { CookieService } from 'ngx-cookie-service';
import {FormBuilder, FormControl, FormGroup, Validators, NgForm} from '@angular/forms';

@Component({
  selector: 'app-register-step1',
  templateUrl: './register-step1.component.html',
  styleUrls: ['./register-step1.component.css']
})
export class RegisterStep1Component implements OnInit {
  cities = Cities;
  medicalFields = MedicalFields;
  doctor = new Doctor();
  workplaces : number;
  submitted = false;
  usernameValid = false;
  imageError : string;
  form
  
  @Output() notify: EventEmitter<Doctor> = new EventEmitter();

  constructor(public router: Router, private http:HttpService, public cookieService: CookieService, private httpService: HttpService) { }

  ngOnInit() {
    console.log(this.router.url);
    if(this.cookieService.get('edit')){
      this.httpService.GetDoctor(this.cookieService.get('edit'),(data)=>{
        this.doctor = data;
      });
    }

  }

  doctorInfo(form:NgForm){
    if(form.dirty){
      this.cookieService.set('docChanged', '');
    }
    this.notify.emit(this.doctor);
    this.router.navigateByUrl('/register/step2');
  }

  checkUsername(){
    let label = document.getElementById('validUsername');

    if(this.doctor.username){
      this.http.CheckUsername(this.doctor.username, (data)=>{
        this.usernameValid = data;
        if(!this.usernameValid){
          label.innerText = 'This username is already taken!';
        }
        else label.innerText = '';
      });

      
    }
  }

  fileChangeEvent(input:any){
    if (input.target.files && input.target.files[0]) {
      // Size Filter Bytes
      const max_size = 20971520;
      const allowed_types = ['image/png', 'image/jpeg'];
      const max_height = 15200;
      const max_width = 25600;

      if (input.target.files[0].size > max_size) {
        this.imageError ='Maximum size allowed is ' + max_size / 1000 + 'Mb';
        return false;
      }

      if (!_.includes(allowed_types, input.target.files[0].type)) {
        this.imageError = 'Only Images are allowed ( JPG | PNG )';
        return false;
      }

      const reader = new FileReader();
      reader.onload = (e: any) => {
        const image = new Image();
        image.src = e.target.result;
        image.onload = rs => {
          const img_height = rs.currentTarget['height'];
          const img_width = rs.currentTarget['width'];
          console.log(img_height, img_width);
          if (img_height > max_height && img_width > max_width) {
            this.imageError =
                  'Maximum dimentions allowed ' +
                  max_height +
                  '*' +
                  max_width +
                  'px';
            return false;
          } else {
            const imgBase64Path = e.target.result;
            this.doctor.image = imgBase64Path;
          }
        };
      };
      reader.readAsDataURL(input.target.files[0]);
    }
  }

}
