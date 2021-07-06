const express = require("express");
const { MongoClient } = require("mongodb");

const app = express();
const server = require("http").createServer(app);
const io = require('socket.io')(server);

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
	require("./routes")(app, db, PASS, filter);
});

app.listen(PORT, ()=>{ console.log(`Listening https on ${PORT}`)});

function filter( obj, filtercheck) {
    let result = {}; 
    Object.keys(obj).forEach((key) => { if (filtercheck(obj[key])) result[key] = obj[key]; })
    return result;
};