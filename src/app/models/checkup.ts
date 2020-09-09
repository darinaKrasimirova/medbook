import {Doctor}  from './doctor';
import {Patient} from './patient';
import {Workplace} from './workplace';

export class Checkup {
    patient: Patient;
    doctor: Doctor;
    workplace: Workplace;
    date: string;
    time: string;
    id: number
    constructor(
    ){}
}
