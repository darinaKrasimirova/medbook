import { Workplace } from './workplace';
import { Doctor } from './doctor';

export class Availability {
    public doctor: Doctor;
    public day: string;
    public from_h: string;
    public to_h: string;
    public workplace: Workplace;
    public id: number;
    constructor(
    ){}
}
