const fs = require('fs')
const express = require("express");
const { MongoClient } = require("mongodb");
const app = express();

app.set("view engine", "ejs");
app.set("views", `${process.cwd()}/views`)
app.use("/map",express.static(`${process.cwd()}/public`));

// const io = require('socket.io')(server);

const PORT = process.env.PORT || 80;
const URL = process.env.URL || require("./secure.json").url;
const mongoClient = new MongoClient(URL, { useUnifiedTopology: true });
mongoClient.connect((err, client)=>{
    let db = client.db("movc");
	let co = db.collection("countries");
	app.get('/countries/:country', (req, res)=>{
        co.findOne({idc: req.params.country}, (err, val)=>{
			if(val) res.render("countries", val);
			else {
				res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
				res.end("Государство не найдено")
			}
		});
    });
});


app.listen(PORT, ()=>{ console.log(`Listening https on ${PORT}`)});