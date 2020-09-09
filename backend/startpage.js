const express = require('express');
const app = express();
const server = require('http').Server(app);
const cors = require('cors');
const port = 8080;
const bodyParser = require('body-parser');
const jsAlert = require('js-alert');

const mysql = require('mysql');
const { json } = require('express');
const con = mysql.createConnection({
	host:'localhost',
	user: 'root',
	password: '',
	database: 'medbook'
});
con.connect((err)=>{
	if(err) throw err;
	console.log("connected to db");
});

app.use(express.static(__dirname+'/public'));
jsonParser = bodyParser.json({limit: '50mb'});
//app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

app.use(cors());
app.listen(port);

//NEW

app.get('/searchByFields', (req,res)=>{
	let field = parseInt(req.query.field);
	let city = parseInt(req.query.city);
	if(field !== field) field = 0;
	if(city !== city) city = 0;
	con.query("SELECT * FROM doctor WHERE medical_field LIKE ? AND city LIKE ?", [MedicalFields[field]+'%', Cities[city]+'%'], (err, result)=>{
		if(err) {
			res.status(400).end();
			con.rollback(()=>{console.log(err);});
		}
		con.commit(err=>{
			if(err) {
				res.status(400).end();
				con.rollback(()=>{console.log(err);});
			}
			res.status(200).json(result);
		});
	});
});

app.get('/searchByName', (req,res)=>{
	let names = [];
	names = names.concat(req.query.name.split(" "));
	con.beginTransaction(err=>{
		if(err) {
			res.status(400).end();
			con.rollback(()=>{console.log(err);});
		}
		con.query("SELECT * FROM doctor WHERE name LIKE ? OR name LIKE ? OR name LIKE ?",['%'+names[0]+'%','%'+names[1]+'%', '%'+req.query.name+'%'], (err,result)=>{
			if(err) {
				res.status(400).end();
				con.rollback(()=>{console.log(err);});
			}
			con.commit(err=>{
				if(err) {
					res.status(400).end();
					con.rollback(()=>{console.log(err);});
				}
				res.json(result);
			});
		});
	});
});

app.get('/checkUsername', (req,res)=>{
	con.beginTransaction(err=>{
		if(err) {
			res.status(400).end();
			con.rollback(()=>{console.log(err);});
		}
		con.query("SELECT COUNT(*) FROM doctor WHERE username=?",[req.query.username], (err,result)=>{
			if(err) {
				res.status(400).end();
				con.rollback(()=>{console.log(err);});
			}
			con.commit(err=>{
				if(err) {
					res.status(400).end();
					con.rollback(()=>{console.log(err);});
				}
				if(result[0]['COUNT(*)']===0 || result[0]['COUNT(*)']==="0")res.status(200).send(true);
				else res.status(200).send(false);
			});
		});
	});
});

app.get('/checkUsernamePatient', (req,res)=>{
	con.beginTransaction(err=>{
		if(err) {
			res.status(400).end();
			con.rollback(()=>{console.log(err);});
		}
		con.query("SELECT COUNT(*) FROM patient WHERE username=?",[req.query.username], (err,result)=>{
			if(err) {
				res.status(400).end();
				con.rollback(()=>{console.log(err);});
			}
			con.commit(err=>{
				if(err) {
					res.status(400).end();
					con.rollback(()=>{console.log(err);});
				}
				if(result[0]['COUNT(*)']===0 || result[0]['COUNT(*)']==="0")res.status(200).send(true);
				else res.status(200).send(false);
			});
		});
	});
});

app.get('/logIn', (req,res)=>{
	con.beginTransaction(err=>{
		if(err) {
			res.status(400).end();
			con.rollback(()=>{console.log(err);});
		}
		con.query("SELECT * FROM doctor WHERE username=? AND password=?", [req.query.username, req.query.password], (err, result)=>{
			if(err) {
				res.status(400).end();
				con.rollback(()=>{console.log(err);});
			}
			con.commit(err=>{
				if(err) {
					res.status(400).end();
					con.rollback(()=>{console.log(err);});
				}
				res.status(200).json(result);
			});
		});
	});
});

app.get('/checkups', (req,res)=>{
	con.beginTransaction(err=>{
		if(err) {
			res.status(400).end();
			con.rollback(()=>{console.log(err);});
		}
		con.query("SELECT c.id, c.doctor_id, c.patient_id, c.workplace_id, c.date, c.time , p.name, p.contact FROM checkup c LEFT JOIN patient p ON c.patient_id=p.id WHERE c.doctor_id=?",[req.query.username], (err, result)=>{
			if(err) {
				res.status(400).end();
				con.rollback(()=>{console.log(err);});
			}
			console.log(result);
			if(result.length>0){
				con.query("SELECT * FROM workplace WHERE id=?", [result[0].workplace_id], (err,result2)=>{
					if(err) {
						res.status(400).end();
						con.rollback(()=>{console.log(err);});
					}
					con.query("SELECT * FROM doctor WHERE username=?", [req.query.username], (err,result3)=>{
						if(err) {
							res.status(400).end();
							con.rollback(()=>{console.log(err);});
						}
						con.commit(err=>{
							if(err) {
								res.status(400).end();
								con.rollback(()=>{console.log(err);});
							}
							let checkupArr = [];
							for(let i=0; i<result.length; i++){
								checkupArr[i] = {patient:{username: result[i].username, name: result[i].name, contact: result[i].contact}, 
												doctor: result3[0], 
												workplace: result2[0], 
												date: result[i].date,
												time: result[i].time, 
												id: result[i].id};
							}
							res.status(200).json(checkupArr);
						});
					});
				});
			
			}else{
				con.commit(err=>{
					if(err) {
						res.status(400).end();
						con.rollback(()=>{console.log(err);});
					}
					let checkupArr = [];
					res.status(200).json(checkupArr);
				});
			}
		});
	});
});

app.get('/availability', (req,res)=>{
	
	let resObj =[];
	con.beginTransaction(err=>{
		if(err) {
			res.status(400).end();
			con.rollback(()=>{console.log(err);});
		}
		con.query("SELECT * FROM availability WHERE doctor_id=?",[req.query.username], (err,result)=>{
			if(err) {
				res.status(400).end();
				con.rollback(()=>{console.log(err);});
			}
			con.query("SELECT * FROM workplace WHERE id=?", [result[0].workplace_id], (err,result2)=>{
				if(err) {
					res.status(400).end();
					con.rollback(()=>{console.log(err);});
				}
				con.query("SELECT * FROM doctor WHERE username=?",[req.query.username], (err,result3)=>{
					if(err) {
						res.status(400).end();
						con.rollback(()=>{console.log(err);});
					}
					for(let i = 0; i<result.length; i++){
						resObj[i]={doctor: result3[0], 
									workplace: result2[0], 
									day: result[i].day, 
									from_h: result[i].from_h, 
									to_h: result[i].to_h};	
					}
					con.commit(err=>{
						if(err) {
							res.status(400).end();
							con.rollback(()=>{console.log(err);});
						}
						res.status(200).json(resObj);
					});
				});
			});
		});
	});
});

app.get('/freeHours', (req,res)=>{
	let date = new Date(req.query.date);
	let day = ()=>{
		switch(date.getDay()){
			case 0 : return "Sunday";
			case 1 : return "Monday";
			case 2 : return "Tuesday";
			case 3 : return "Wednesday";
			case 4 : return "Thursday";
			case 5 : return "Friday";
			case 6 : return "Saturday";
		}
	}
	day = day();

	con.beginTransaction(err=>{
		if(err) {
			res.status(400).end();
			con.rollback(()=>{console.log(err);});
		}
		con.query("SELECT * FROM availability WHERE doctor_id=? AND day=?", [req.query.username, day], (err, result)=>{
			if(err) {
				res.status(400).end();
				con.rollback(()=>{console.log(err);});
			}
			if(result.length>0){
				let a = (result[0].from_h).split(':');
				let start = parseInt(a[0], 10)*60 + parseInt(a[1], 10);
				let b = (result[0].to_h).split(':');
				let end = parseInt(b[0],10)*60 + parseInt(b[1],10);
				let resp = [];
				for(let i = start, j=0; i<end-30; i+=30, j++){
					let mins = (i%60).toString().length===1 ?  "0" + i%60 : i%60;
					resp[j] = parseInt(i/60,10) + ":" + mins ;
				}
				con.query("SELECT * FROM checkup WHERE doctor_id=? AND date=?",[req.query.username, req.query.date], (err, result)=>{
					if(err) {
						res.status(400).end();
						con.rollback(()=>{console.log(err);});
					}
					for(let i = 0; i<result.length; i++){
						resp = resp.filter(time => time!==result[i].time);
					}
					con.commit(err=>{
						if(err) {
							res.status(400).end();
							con.rollback(()=>{console.log(err);});
						}
						res.status(200).json(resp);
					});
				});
			}
			else{
				con.commit(err=>{
					if(err) {
						res.status(400).end();
						con.rollback(()=>{console.log(err);});
					}
					res.status(200).json([]);
				});
			}
		});
	});
});

app.post('/register', jsonParser, (req,res)=>{
	let doctor = req.body.doctor;
	let workplace = req.body.workplace;
	let availability = req.body.availability;
	let avail = [];
	con.beginTransaction(err=>{
		if(err) {
			res.status(400).end();
			con.rollback(()=>{console.log(err);});
		}
		con.query("INSERT INTO doctor (username, password, name, education, practicing_since, practice, medical_field, services, city) VALUES(?,?,?,?,?,?,?,?,?)",[doctor.username, doctor.password, doctor.name, doctor.education, doctor.practicing_since, doctor.practice,MedicalFields[parseInt(doctor.medical_field)], doctor.services,Cities[parseInt(doctor.city)]], (err, result)=>{
			if(err) {
				res.status(400).end();
				con.rollback(()=>{console.log(err);});
			}
			con.query("INSERT INTO workplace (name, address, city) VALUES (?,?,?)", [workplace.name, workplace.address, Cities[parseInt(workplace.city)]], (err, result)=>{
				if(err) {
					res.status(400).end();
					con.rollback(()=>{console.log(err);});
				}
				console.log(result);
				for(let i = 0; i<availability.length; i++){
					avail[i] = [availability[i].day, availability[i].from_h, availability[i].to_h, doctor.username, result.insertId];
				}
				con.query("INSERT INTO availability (day, from_h, to_h, doctor_id, workplace_id) VALUES ?", [avail], (err, result)=>{
					if(err) {
						res.status(400).end();
						con.rollback(()=>{console.log(err);});
					}
					con.commit(err=>{
						if(err) {
							res.status(400).end();
							con.rollback(()=>{console.log(err);});
						}
						res.status(201);
					});
				});
			});
		});
	});
})

app.delete("/deleteCheckup", (req,res)=>{
	con.beginTransaction(err=>{
		if(err) {
			res.status(400).end();
			con.rollback(()=>{console.log(err);});
		}
		con.query("DELETE FROM checkup WHERE id=?", [parseInt(req.query.id)], (err,result)=>{
			if(err) {
				res.status(400).end();
				con.rollback(()=>{console.log(err);});
			}
			con.commit(err=>{
				if(err) {
					res.status(400).end();
					con.rollback(()=>{console.log(err);});
				}
				res.status(200).send(true);
			});
		});
	});
});

app.get("/getDoctor", (req,res)=>{
	con.beginTransaction(err=>{
		if(err) {
			res.status(400).end();
			con.rollback(()=>{console.log(err);});
		}
		con.query("SELECT * FROM doctor WHERE username=?", req.query.username, (err,result)=>{
			if(err) {
				res.status(400).end();
				con.rollback(()=>{console.log(err);});
			}
			con.commit(err=>{
				if(err) {
					res.status(400).end();
					con.rollback(()=>{console.log(err);});
				}
				res.status(200).json(result);
			});
		});
	});
});

app.post("/bookAppointment", jsonParser, (req, res)=>{
	con.beginTransaction(err=>{
		if(err) {
			res.status(400).end();
			con.rollback(()=>{console.log(err);});
		}
		con.query("INSERT INTO checkup (doctor_id, patient_id, workplace_id, date, time) VALUES (?,?,?,?,?)", 
				[req.body.doctor, req.body.patient,req.body.workplace, req.body.date, req.body.time] , (err, result)=>{
			if(err) {
				res.status(400).end();
				con.rollback(()=>{console.log(err);});
			}
			con.commit(err=>{
				if(err) {
					res.status(400).end();
					con.rollback(()=>{console.log(err);});
				}
				res.status(201).send(true);
			});
		});
	});
});

app.post("/registerPatient", jsonParser, (req, res)=>{
	con.beginTransaction(err=>{
		if(err) {
			res.status(400).end();
			con.rollback(()=>{console.log(err);});
		}
		con.query("INSERT INTO patient (username, password, name, contact) VALUES (?,?,?,?)", 
				[req.body.username, req.body.password, req.body.name, req.body.contact], (err, result)=>{
			if(err) {
				res.status(400).end();
				con.rollback(()=>{console.log(err);});
			}
			con.commit(err=>{
				if(err) {
					res.status(400).end();
					con.rollback(()=>{console.log(err);});
				}
				res.status(201).send(true);
			});
		});
	});
});

app.get("/logInPatient", (req,res)=>{
	con.beginTransaction(err=>{
		if(err) {
			res.status(400).end();
			con.rollback(()=>{console.log(err);});
		}
		con.query("SELECT * FROM patient WHERE username=? AND password=?", [req.query.username, req.query.password], (err,result)=>{
			if(err) {
				res.status(400).end();
				con.rollback(()=>{console.log(err);});
			}
			con.commit(err=>{
				if(err) {
					res.status(400).end();
					con.rollback(()=>{console.log(err);});
				}
				res.status(200).json(result);
			});
		});
	});
});

app.post("/updateWorkplace", jsonParser, (req,res)=>{
	con.beginTransaction(err=>{
		if(err) {
			res.status(400).end();
			con.rollback(()=>{console.log(err);});
		}
		con.query("INSERT INTO workplace (name, address, city) VALUES (?,?,?)", [req.body.name, req.body.address, req.body.city], (err, result)=>{
			if(err) {
				res.status(400).end();
				con.rollback(()=>{console.log(err);});
			}
			console.log('insert workplace');
			con.query("UPDATE availability SET workplace_id=? WHERE doctor_id=?", [result.insertId,req.body.username], (err, result)=>{
				if(err) {
					res.status(400).end();
					con.rollback(()=>{console.log(err);});
				}
				console.log('update avail');
				con.commit(err=>{
					if(err) {
						res.status(400).end();
						con.rollback(()=>{console.log(err);});
					}
					res.status(201);
				});
			});
		});
	});
});

app.post("/updateAvailability", jsonParser, (req, res)=>{
	let availability = req.body.availability;
	let avail = [];
	con.beginTransaction(err=>{
		if(err) {
			res.status(400).end();
			con.rollback(()=>{console.log(err);});
		}
		con.query("SELECT workplace_id FROM availability WHERE doctor_id=?", [req.body.username], (err, result)=>{
			if(err) {
				res.status(400).end();
				con.rollback(()=>{console.log(err);});
			}
			con.query("DELETE FROM availability WHERE doctor_id=?", req.body.username,(err, result1)=>{
				if(err) {
					res.status(400).end();
					con.rollback(()=>{console.log(err);});
				}
				for(let i = 0; i<availability.length; i++){
					avail[i] = [availability[i].day, availability[i].from_h, availability[i].to_h, req.body.username, result[0].workplace_id];
				}
				con.query("INSERT INTO availability (day, from_h, to_h, doctor_id, workplace_id) VALUES ?", [avail], (err, result)=>{
					if(err) {
						res.status(400).end();
						con.rollback(()=>{console.log(err);});
					}
					con.commit(err=>{
						if(err) {
							res.status(400).end();
							con.rollback(()=>{console.log(err);});
						}
						res.status(201);
					});
				});
			});
		});
	});
});

app.post("/updateDoctor", jsonParser, (req, res)=>{
	con.beginTransaction(err=>{
		if(err) {
			res.status(400).end();
			con.rollback(()=>{console.log(err);});
		}
		con.query("UPDATE doctor SET password=?, name=?, education=?, practicing_since=?, practice=?, medical_field=?, services=?, city=?, image=? WHERE username=?", [req.body.password, req.body.name, req.body.education, req.body.practicing_since, req.body.practice,req.body.medical_field, req.body.services,req.body.city,req.body.image, req.body.username], (err,result)=>{
			if(err) {
				res.status(400).end();
				con.rollback(()=>{console.log(err);});
			}
			// con.query("UPDATE doctor SET image=? WHERE username=?", [req.body.image,  req.body.username], (err,result)=>{
			// 	if(err) {
			// 		// console.log(err.toString().splice(0,err.toString().length-200));
			// 		// require('fs').writeFile('C:\Users\Darina\Desktop\m.txt', err.toString(),'UTF8', ()=>{});
			// 		res.status(400).end();
			// 		con.rollback(()=>{console.log(err);});
			// 	}
				con.commit(err=>{
					if(err) {
						res.status(400).end();
						con.rollback(()=>{console.log(err);});
					}
					res.status(201);
				});
			//});
			
		});
	});
});

MedicalFields = ["",
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
    "Urology"];
Cities = ["",
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
    "Yambol"];
