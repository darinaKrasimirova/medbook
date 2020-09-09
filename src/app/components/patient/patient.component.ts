import { Component, OnInit, Output} from '@angular/core';
import { Patient } from 'src/app/models/patient'
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { HttpService } from 'src/app/http.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-patient',
  templateUrl: './patient.component.html',
  styleUrls: ['./patient.component.css']
})
export class PatientComponent implements OnInit {
  patient: Patient;
  validUsername: boolean;
  register: boolean;
  confirmInfo: boolean;
  date: string;
  time: string;
  doc: string;
  docName: string;
  workplace: string;
  workplaceId: string;

  constructor(private router: Router, private httpService: HttpService, private cookieService: CookieService) { }

  ngOnInit() {
    this.register = (this.router.url === '/patientRegister');
    this.patient = new Patient();
  }

  checkUsernamePatient(){
    let label = document.getElementById('validUsername');
    this.httpService.CheckUsernamePatient(this.patient.username, (data)=>{
      this.validUsername = data;
      if(!data){
        label.innerText = 'This username is already taken!';
      }
      else label.innerText = '';
    });
  }

  registerPatient(){
    console.log( this.patient);
    this.httpService.RegisterPatient(this.patient.username, this.patient.password, 
              this.patient.name, this.patient.contact, (data)=>{
      this.router.navigateByUrl('/patient');
    });
  }

  logInPatient(){
    this.httpService.LogInPatient(this.patient.username, this.patient.password, (data: Patient)=>{
      this.patient = data;
      if(this.cookieService.check('appointmentDate') && this.cookieService.check('appointmentTime')){
        this.confirmInfo = true;
        this.date = this.cookieService.get('appointmentDate');
        this.time = this.cookieService.get('appointmentTime');
        this.doc = this.cookieService.get('appointmentDoc');
        this.docName = this.cookieService.get('appointmentDocName');
        this.workplace = this.cookieService.get('appointmentWorkplace');
        this.workplaceId = this.cookieService.get('appointmentWorkplaceId');
      }else{
        alert('Not chosen date and time for appointment');
        this.router.navigateByUrl('/results');
      }
    });
  }

  Book(){
    this.httpService.BookAppointment(this.doc, this.patient.id.toString(), this.workplaceId, this.date, this.time, (data)=>{
      if(data) alert('Appointment booked successfully');
    })
  }


}
