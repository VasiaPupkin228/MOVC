const sha3 = require('js-sha3').sha3_224;
const utils = require("./utils");
module.exports = (app,db,PASS,filter)=>{
    let co = db.collection("countries");
	let pending = db.collection("pending-countries");
	let deleted = db.collection("deleted-countries");
	let geo = db.collection("geo");
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
        pending.findOne({cidc: req.params.country}, (err, val)=>{
			if(val) res.render("pages/pending-country", {country: val});
			else {
				res.render("pages/notfound")
			}
		});
    });
	app.get('/pending-countries', (req, res)=>{
        pending.find({}, {name:1, cidc:1, description:1}).toArray((err, results)=>{
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
	app.get("/admin/bind", (req,res)=>{
		res.render("pages/bind");
	});
	app.get("/admin/delete-country", (req,res)=>{
		res.render("pages/delete-country");
	});
	app.get("/admin/edit-country-map", (req,res)=>{
		res.render("pages/edit-country-map");
	});
	app.post("/delete-country", (req, res)=>{
		let country = req.body || false;
		if(!country){
			res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
			res.end("Нет тела запроса");
			return;
		} 
		let pass = req.query.pass || country.pass;
		if(pass && sha3(pass) == PASS){
			pending.findOne({cidc:country.cidc}, (err, val)=>{
				if (err||!val){
					return res.end(JSON.stringify({
						code:2,
						message:"Country is not deleted||nothing to delete",
						err:`${err}`
					}));
				} else{
					res.redirect("/pending-countries");
				}
				delete val._id;
				deleted.insertOne(val);
				pending.deleteOne({cidc:country.cidc});
			});
		} else{
			res.end("Hackerman?")
		}
	});
	app.post("/country-preview", (req, res)=>{
		let country = req.body;
		if(country.verified==="half") {}
		else if(country.verified==="false") country.verified = false;
		else if(country.verified) country.verified = true;
		else if(!country.verified) country.verified = "pending"
		country.description = utils.replacespec(country.description);
		res.render("pages/country", {country})
	});
	app.post("/approve-country", (req, res)=>{
		let country = req.body || false;
		if(!country){
			res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
			res.end("Нет тела запроса");
			return;
		} 
		let pass = req.query.pass || country.pass;
		if(pass && sha3(pass) == PASS){
			pending.findOne({idc:country.idc},(err, val)=>{
				if(!val){
					res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
					return res.end("Нечего подтверждать")
				}
				delete val._id;
				delete val.cidc;
				if(country.verified==="half") {}
				else if(country.verified==="false") country.verified = false;
				else if(country.verified) country.verified = true;
				else if(!country.verified) country.verified = "pending"
				val.verified = country.verified;
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
			res.end("Hackerman?");
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
		else if(country.verified==="false") country.verified = false;
		else if(country.verified) country.verified = true;
		else if(!country.verified) country.verified = "pending"

		if(country.rank) country.rank = parseInt(country.rank);

		country = filter(country, (val)=>{
			return val !== "";
		});
		country.description = utils.replacespec(country.description);
		if(country.description === false) delete country.description;
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
			country.cidc = sha3(""+Math.random()+Date.now());
			pending.insertOne(country,()=>{
				if (err){
					res.end(JSON.stringify({
						code:2,
						message:"Country is not added",
						err:`${err}`
					}));
				} else{
					res.redirect(`/pending-countries/${country.cidc}`);
				}
			});
		}
		
    });
	app.get("/api/maingeo", (req,res)=>{
		geo.findOne({type:"main"}, (err, val)=>{
			res.end(JSON.stringify(val.geojson.features, null, "  "));
		});
	});
	app.post("/api/country", (req,res)=>{
		co.findOne({idc:req.body.idc}, (err, val)=>{
			res.end(JSON.stringify(val, null, "  "));
		});
	});
	app.use((req, res)=>{
		res.status(404);
		res.render("pages/notfound")
	});
}