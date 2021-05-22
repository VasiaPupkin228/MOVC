const fs = require('fs')
const express = require("express");
const sha3 = require('js-sha3').sha3_224;
const { MongoClient } = require("mongodb");
const app = express();
const jsonParser = express.json();

app.set("view engine", "ejs");
app.set("views", `${process.cwd()}/views`)
app.use("/map",express.static(`${process.cwd()}/public`));

// const io = require('socket.io')(server);

const PORT = process.env.PORT || 80;
const PASS = process.env.PASS || require("./secure.json").pass;
const URL = process.env.URL || require("./secure.json").url;
const mongoClient = new MongoClient(URL, { useUnifiedTopology: true });
mongoClient.connect((err, client)=>{
    let db = client.db("movc");
	let co = db.collection("countries");
	app.get('/countries/:country', (req, res)=>{
        co.findOne({idc: req.params.country}, (err, val)=>{
			if(val) res.render("country", {country: val});
			else {
				res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
				res.end("Государство не найдено")
			}
		});
    });
	app.get('/countries', (req, res)=>{
        co.find({}, {name:1, idc:1, description:1}).toArray((err, results)=>{
			co.countDocuments((_,v)=>{
				res.render("countries", {val:results, count:v});
			});
		});
    });
	app.post('/addcountry', jsonParser,(req, res)=>{
		let country = req.body || false;
		if(!country){
			res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
			res.end("Нет тела запроса");
			return;
		} 
		if(sha3(req.query.pass) == PASS){
			co.updateOne({idc: country.idc},{$set: country}, {upsert:true},
				(err)=>{
					if (err){
						res.end(JSON.stringify({
							code:2,
							message:"Country is not added",
							err:`${err}`
						}));
					} else{
						res.end(JSON.stringify({
							code:0,
							message:"Succes added country"
						}));
					}
				});
		} else{
			res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
			res.end("Взломать захотел?")
		}
    });
});


app.listen(PORT, ()=>{ console.log(`Listening https on ${PORT}`)});