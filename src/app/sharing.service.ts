import { Injectable } from '@angular/core';
import { Doctor } from './models/doctor';

@Injectable()
export class SharingService {
    data:any;
    doctorResults: Doctor[]; //on searching for doctors
    doctor: Doctor; //on logging in 
    searchingParams: any; //on searching for doctors
    doc: Doctor; //on viewing profile after search

    constructor() { }
    setDoctorResults(data){
         this.doctorResults=data;
    }
    getDoctorResults():Doctor[]{
         return this.doctorResults;
    }

    setDoctor(data:Doctor){
         this.doctor = data;
    }
    getDoctor():Doctor{
         return this.doctor;
    }

    setSearchingParams(data:any){
         this.searchingParams = data;
    }
    getSeachingParams(){
         return this.searchingParams;
    }

    setDoc(data:Doctor){
         this.doc = data;
    }
    getDoc():Doctor{
         console.log(this.doc)
         return this.doc;
    }
} 