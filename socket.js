const sha3 = require('js-sha3').sha3_224;
module.exports = (io,db,PASS,filter)=>{
    let cw = db.collection("clickwars");
    io.on('connection', socket => {
        socket.on("clickwar", data=>{
            
        });
    });
}