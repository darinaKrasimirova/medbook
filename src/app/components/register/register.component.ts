import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Doctor } from 'src/app/models/doctor';
import { CookieService } from 'ngx-cookie-service';
import { HttpService } from 'src/app/http.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  
  doctor: Doctor;
  edit: boolean;
  constructor(public route: ActivatedRoute, public routerr: Router, public cookieService: CookieService, private httpService: HttpService) { }

  ngOnInit() {
    this.edit = this.cookieService.check('edit');
  }

  OnNotify(message: Doctor){
    this.doctor = message;
  }
}
