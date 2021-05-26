const express = require("express");
const sha3 = require('js-sha3').sha3_224;
const { MongoClient } = require("mongodb");
const app = express();
const favicon = require('serve-favicon');
app.set("view engine", "ejs");
app.set("views", `${__dirname}/views`)

app.use("/public",express.static(`${__dirname}/public`));
app.use(favicon(`${__dirname}/public/favicon.ico`));
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

const PORT = process.env.PORT || 80;
const PASS = process.env.PASS || require("./secure.json").pass;
const URL = process.env.URL || require("./secure.json").url;
const mongoClient = new MongoClient(URL, { useUnifiedTopology: true });
mongoClient.connect((err, client)=>{
    let db = client.db("movc");
	let co = db.collection("countries");
	let pending = db.collection("pending-countries");
	app.get("/", (req,res)=>{
		res.redirect("/countries")
	});
	app.get("/req-country", (req, res)=>{
		res.render("pages/req-country");
	});
	app.get('/countries/:country', (req, res)=>{
        co.findOne({idc: req.params.country}, (err, val)=>{
			if(val) res.render("pages/country", {country: val});
			else {
				res.render("pages/notfound")
			}
		});
    });
	app.get('/countries', (req, res)=>{
        co.find({}, {name:1, idc:1, description:1}).sort({rank:-1}).toArray((err, results)=>{
			co.countDocuments((_,v)=>{
				res.render("pages/countries", {val:results, count:v});
			});
		});
    });

	app.get('/pending-countries/:country', (req, res)=>{
        pending.findOne({idc: req.params.country}, (err, val)=>{
			if(val) res.render("pages/pending-country", {country: val});
			else {
				res.render("pages/notfound")
			}
		});
    });
	app.get('/pending-countries', (req, res)=>{
        pending.find({}, {name:1, idc:1, description:1}).toArray((err, results)=>{
			pending.countDocuments((_,v)=>{
				res.render("pages/pending-countries", {val:results, count:v});
			});
		});
    });

	app.get('/map', (req, res)=>{
        res.render("pages/map");
    });
	app.get('/erth2', (req, res)=>{
		co.find({verified:true}).count((_,v)=>{
        	res.render("pages/erth2", {count:v});
		});
    });
	app.get("/admin", (req,res)=>{
		res.render("pages/admin");
	});
	app.get("/admin/addcountry", (req,res)=>{
		res.render("pages/addcountry");
	});
	app.get("/admin/approve-country", (req,res)=>{
		res.render("pages/approve-country");
	});
	app.post("/approve-country", (req, res)=>{
		let country = req.body || false;
		if(!country){
			res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
			res.end("Нет тела запроса");
			return;
		} 
		let pass = req.query.pass || country.pass;
		delete country._id
		if(pass && sha3(pass) == PASS){
			pending.findOne({idc:country.idc},(err, val)=>{
				co.updateOne({idc: country.idc},{$set: val}, {upsert:true},
				(err)=>{
					if (err){
						res.end(JSON.stringify({
							code:2,
							message:"Country is not added",
							err:`${err}`
						}));
					} else{
						pending.deleteOne({idc: country.idc}, (err)=>{
							if (err){
								res.end(JSON.stringify({
									code:2,
									message:"Country is not added",
									err:`${err}`
								}));
							} else{
								res.redirect(`/countries/${country.idc}`)
							}
						});
					}
				});
			});
		} else{
			res.end("Hackerman bleat?");
		}
	});
	app.post('/addcountry', (req, res)=>{
		let country = req.body || false;
		if(!country||!country.idc){
			res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
			res.end("Нет тела запроса, или не указан id страны");
			return;
		} 
		let pass = req.query.pass || country.pass;
		country.pass = "";
		
		if(country.verified==="half") {}
		else if(country.verified) country.verified = true;
		else country.verified = false;

		if(country.rank) country.rank = parseInt(country.rank);

		country = filter(country, (val)=>{
			return val !== "";
		});
		if(pass && sha3(pass) == PASS){
			co.updateOne({idc: country.idc},{$set: country}, {upsert:true},
				(err)=>{
					if (err){
						res.end(JSON.stringify({
							code:2,
							message:"Country is not added",
							err:`${err}`
						}));
					} else{
						res.redirect(`/countries/${country.idc}`);
					}
				});
		} else{
			pending.insertOne(country,()=>{
				if (err){
					res.end(JSON.stringify({
						code:2,
						message:"Country is not added",
						err:`${err}`
					}));
				} else{
					res.redirect(`/pending-countries/${country.idc}`);
				}
			});
		}
		
    });
	app.use((req, res, next)=>{
		res.status(404);
		res.render("pages/notfound")
	});
});

app.listen(PORT, ()=>{ console.log(`Listening https on ${PORT}`)});

function filter( obj, filtercheck) {
    let result = {}; 
    Object.keys(obj).forEach((key) => { if (filtercheck(obj[key])) result[key] = obj[key]; })
    return result;
};