import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Doctor } from './models/doctor';
import { Checkup } from './models/checkup';
import { Availability } from './models/availability';
import { Patient } from './models/patient';

@Injectable()
export class HttpService {
    constructor(private http: HttpClient) { }


    SearchByFields(field: any, city: any, func: Function) {
        let params = new HttpParams();
        params = params.append("field", field);
        params = params.append("city", city);
            
        this.http.get<Doctor[]>("http://localhost:8080/searchByFields", {params: params}).subscribe((data:Doctor[])=>{
            func(data);
        });
    }

    SearchByName(name: any, func: Function){
        let params = new HttpParams();
        params = params.append("name", name);
        
        this.http.get<Doctor[]>("http://localhost:8080/searchByName", {params: params}).subscribe((data:Doctor[])=>{
          func(data);
        }); 
    }

    LogIn(username: any, password: any, func: Function){
    
        let params = new HttpParams();
        params = params.append("username", username);
        params = params.append("password", password);
    
        this.http.get<Doctor[]>("http://localhost:8080/logIn", {params: params}).subscribe((data: Doctor[])=>{
          func(data);
        });
    }

    LoadCheckups(username: any, func: Function) {
        let params = new HttpParams();
        params = params.append("username", username);
        this.http.get<Checkup[]>("http://localhost:8080/checkups", {params: params}).subscribe((checkups: Checkup[])=>{
            //checkups = data;
            func(checkups);
            console.log(checkups);
        });
        
    }

    DeleteCheckup(id:number){
        let params = new HttpParams();
        params = params.append("id", id.toString());
        this.http.delete("http://localhost:8080/deleteCheckup", {params: params}).subscribe((data:any)=>{
          
        });
    }

    CheckUsername(username: any, func: Function) {
          let params = new HttpParams();
          params = params.append("username", username);
          this.http.get<boolean>("http://localhost:8080/checkUsername", {params: params}).subscribe((data: boolean)=>{
            func(data);
        });
    }

    SubmitRegistration(doctor: any, workplace: any, availability: any, func: Function){
        let headers = new HttpHeaders();
        headers.append('Content-Type', 'application/json');
        let body = {doctor: doctor, workplace: workplace,  availability: availability};
        this.http.post<any>("http://localhost:8080/register",body, {headers: headers}).subscribe((data: any)=>{
        func();
        });
    }

    LoadDocProfile(username: any, func: Function) {
        let params = new HttpParams();
        params = params.append("username", username);
        this.http.get<Availability[]>("http://localhost:8080/availability", {params:params}).subscribe((data:Availability[])=>{
        func(data);
        });
    }

    GetFreeHours(chosenDate: any, username: any, func?: Function){
        let params = new HttpParams();
        params = params.append("date", chosenDate);
        params = params.append("username", username);
        this.http.get<string[]>("http://localhost:8080/freeHours", {params:params}).subscribe((data:string[])=>{
          func(data);
          console.log(data)
        });
    }

    DeleteProfile(username: string, func?: Function){
        let params = new HttpParams();
        params = params.append("username", username);
        this.http.delete("http://localhost:8080/deleteProfile", {params: params}).subscribe((data:any)=>{
            if(func) func();
        });
    }

    GetDoctor(username: string, func: Function){
        let params = new HttpParams();
        params = params.append("username", username);
        this.http.get<Doctor[]>("http://localhost:8080/getDoctor", {params: params}).subscribe((data: Doctor[])=>{
            func(data[0]);
        });
    }

    BookAppointment(doc: string, patient: string, workplace: string, date: string, time:string, func: Function){
        let headers = new HttpHeaders();
        headers.append('Content-Type', 'application/json');
        let body = {doctor: doc, patient: patient, workplace: workplace, date: date, time: time};
        this.http.post("http://localhost:8080/bookAppointment", body, {headers: headers}).subscribe((data:boolean)=>{
            func(data);
        });
    }

    RegisterPatient(username: string, password: string, name: string, contact: string, func: Function){
        let headers = new HttpHeaders();
        headers.append('Content-Type', 'application/json');
        let body = {username: username, password: password, name: name, contact: contact};
        console.log(body);
        this.http.post<any>("http://localhost:8080/registerPatient", body, {headers: headers}).subscribe((data: any)=>{
            func(data);
        });
    }

    LogInPatient(username: string, password:string, func: Function){
        let params = new HttpParams();
        params = params.append("username", username);
        params = params.append("password", password);
        this.http.get<Patient[]>("http://localhost:8080/logInPatient", {params: params}).subscribe((data:Patient[])=>{
            func(data[0]);
        });
    }

    CheckUsernamePatient(username: any, func: Function) {
        let params = new HttpParams();
        params = params.append("username", username);
        this.http.get<boolean>("http://localhost:8080/checkUsernamePatient", {params: params}).subscribe((data: boolean)=>{
          func(data);
      });
    }

    UpdateWorkplace(name: string, address: string, city: string, username: string, func: Function){
        let headers = new HttpHeaders();
        headers.append('Content-Type', 'application/json');
        let body = {name: name, address: address,city: city, username: username};
        this.http.post("http://localhost:8080/updateWorkplace", body, {headers:headers}).subscribe((data)=>{
            func(data);
        });
    }

    UpdateAvailability(username: string, availavility: Availability[], func: Function){
        let headers = new HttpHeaders();
        headers.append('Content-Type', 'application/json');
        let body = {username: username, availability: availavility};
        this.http.post("http://localhost:8080/updateAvailability", body, {headers:headers}).subscribe((data)=>{
            func(data);
        });
    }

    UpdateDoctor(doctor: Doctor, func: Function){
        let headers = new HttpHeaders();
        headers.append('Content-Type', 'application/json');
        this.http.post("http://localhost:8080/updateDoctor", doctor, {headers: headers}).subscribe((data)=>{
            func(data);
        });
    }
}