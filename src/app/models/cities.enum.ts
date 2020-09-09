export enum Cities {
    "",
    "Asenovgrad",
    "Blagoevgrad",
    "Burgas",
    "Varna",
    "Veliko Tarnovo",
    "Vratsa",
    "Gabrovo",
    "Dobrich",
    "Pazardzhik",
    "Pernik",
    "Pleven",
    "Plovdiv",
    "Ruse",
    "Sliven",
    "Sofia",
    "Stara Zagora",
    "Haskovo",
    "Shumen",
    "Yambol"
}

export namespace Cities {
    export function keys() {
        return Object.keys(Cities).filter(k => !isNaN(Number(k)));
    }
}