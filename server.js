const fs = require('fs')
const express = require("express");
const app = express();
const options = require("./options");
app.use(express.static(`${process.cwd()}/public`));
let server;

if(options.protocol === "https"){
	//--deprecated on dev--\\
	// server = require('https').createServer({
	//   key: fs.readFileSync( './ssl/private.key' , 'utf-8'),
	//   cert: fs.readFileSync( './ssl/certificate.crt', 'utf-8' ),
	//   ca: fs.readFileSync( './ssl/ca_bundle.crt', 'utf-8' ),
	//   csr: fs.readFileSync( './ssl/csr.crt', 'utf-8' )
	// }, app);
} else{
	server = require('http').createServer(app);
}

const io = require('socket.io')(server);

server.listen(options.port, options.ip, ()=>{
	console.log(`Listening on ${options.ip}:${options.port} or ${options.public}`)
});