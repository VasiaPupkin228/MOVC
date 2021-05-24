const express = require("express");
const sha3 = require('js-sha3').sha3_224;
const { MongoClient } = require("mongodb");
const app = express();
app.set("view engine", "ejs");
app.set("views", `${process.cwd()}/views`)

app.use("/public",express.static(`${process.cwd()}/public`));
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

const PORT = process.env.PORT || 80;
const PASS = process.env.PASS || require("./secure.json").pass;
const URL = process.env.URL || require("./secure.json").url;
const mongoClient = new MongoClient(URL, { useUnifiedTopology: true });
mongoClient.connect((err, client)=>{
    let db = client.db("movc");
	let co = db.collection("countries");
	app.get("/", (req,res)=>{
		res.redirect("/countries")
	})
	app.get('/countries/:country', (req, res)=>{
        co.findOne({idc: req.params.country}, (err, val)=>{
			if(val) res.render("pages/country", {country: val});
			else {
				res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
				res.end("Государство не найдено")
			}
		});
    });
	app.get('/countries', (req, res)=>{
        co.find({}, {name:1, idc:1, description:1}).toArray((err, results)=>{
			co.countDocuments((_,v)=>{
				res.render("pages/countries", {val:results, count:v});
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
	app.get("/admin/addcountry", (req,res)=>{
		res.render("pages/addcountry");
	});
	app.post('/addcountry', (req, res)=>{
		let country = req.body || false;
		if(!country){
			res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
			res.end("Нет тела запроса");
			return;
		} 
		let pass = req.query.pass || country.pass;
		country.pass = "";
		if(country.verified) country.verified = true;
		country = filter(country, (val)=>{
			return val !== "";
		});
		console.log(country);
		if(sha3(pass) == PASS){
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
			res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
			res.end("Неправильный пароль")
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