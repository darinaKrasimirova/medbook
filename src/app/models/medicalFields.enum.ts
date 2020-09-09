export enum MedicalFields {
    "",
    "Anesthesiology",
    "Cardiology",
    "Dermatology",
    "Endocrinology",
    "Family Medicine",
    "Gastroenterology",
    "Gynecology",
    "Hematology",
    "Infectious Disease Medicine",
    "Medical Genetics",
    "Nephrology",
    "Neurology",
    "Oncology",
    "Ophthalmology",
    "Osteopathy",
    "Otolaryngology",
    "Pathology",
    "Pediatry",
    "Physiatry",
    "Plastic Surgery",
    "Podiatry",
    "Preventive Medicine",
    "Psychiatry",
    "Pulmonology",
    "Radiology",
    "Rheumatology",
    "Urology"
}

export namespace MedicalFields {
    export function keys() {
        return Object.keys(MedicalFields).filter(k => !isNaN(Number(k)));
    }
}
