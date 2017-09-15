const path = require("path");
const http = require("http");
const express = require("express");
const socketIO = require("socket.io");


const port = process.env.PORT || 37500;
const publicPath =path.join(__dirname,"/public");

var app =  express();
var server = http.createServer(app);
var io = socketIO(server);


app.use(express.static(publicPath));


io.on('connection', (socket)=> {
	console.log('new user connected');
	
	socket.emit('newEmail',{
		name:'mohamed',
		age:33
	});


	socket.on('disconnect', ()=> {
		console.log('user out');
	});
});




console.log(publicPath);

server.listen(port,function(message){
	console.log(`server started on port : ${port} ` );
});