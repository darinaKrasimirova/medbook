import { Component, OnInit } from '@angular/core';
import { SharingService } from '../../sharing.service'
import { Doctor } from 'src/app/models/doctor';
import { Checkup } from 'src/app/models/checkup';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { HttpService } from 'src/app/http.service';
import { Router, ROUTER_CONFIGURATION } from '@angular/router';

@Component({
  selector: 'app-myProfile',
  templateUrl: './myProfile.component.html',
  styleUrls: ['./myProfile.component.css']
})
export class MyProfileComponent implements OnInit {
  doctor: Doctor;
  checkups: Checkup[];
  showContent: boolean;

  constructor(private shService: SharingService, public http: HttpService, 
    private router: Router, private cookieService: CookieService) { }

  async ngOnInit() {
    
    if(this.cookieService.check('loggedInUsername')&&this.cookieService.check('loggedInPassword') ){
      //console.log(this.cookieService.get('loggedInUsername') + '   1')
      let username = this.cookieService.get('loggedInUsername');
      let password = this.cookieService.get('loggedInPassword');
      this.http.LogIn(username, password, (data: Doctor[])=>{
        this.cookieService.set('loggedInUsername',username, 2);
        this.cookieService.set('loggedInPassword',password, 2);
        if(!data[0]){
          alert('Wrong username or password');
          this.router.navigateByUrl('/home');
        }
        this.doctor = data[0];
       console.log(data);
      });
      
      await new Promise(resolve => setTimeout(()=>resolve(), 1000)).then(()=>{
        this.http.LoadCheckups(this.doctor.username, (data)=>{
          this.checkups = data;
          this.showContent = true;
        });
      });
      //alert('doctor' + this.doctor);
      
      //setTimeout(()=>this.showContent=true, 1000);
      console.log(this.checkups);
      
    }else{
      alert('Your session has ended. You will be redirected to homapage');
      this.router.navigateByUrl('/home');
    }

    //this.doctor = this.shService.getDoctor();
    
  }

  Edit(){
    this.cookieService.set('edit', this.doctor.username, 0.0125);
  }
  
  LogOut(){
    if(confirm('Logout?')){
      //console.log(this.cookieService.getAll());
      //this.cookieService.deleteAll(this.router.url);
      this.cookieService.delete('loggedInUsername');
      this.cookieService.delete('loggedInPassword');
      
      // this.cookieService.delete('loggedInUsername');
      // this.cookieService.delete('loggedInPassword');
      // this.router.navigateByUrl('/home');
      //console.log(this.cookieService.getAll());
      //alert('');
    }
  }
  
  DeleteProfile(){
    if(confirm('Are you sure you want to delete this profile?')){
      this.http.DeleteProfile(this.doctor.username, ()=>{});
      this.router.navigateByUrl('/home');
    }
  }
}
