const express = require('express');
const http = require('http');
//const url = require('url');
const WebSocket = require('ws');
const handleForm = require('./gahez-handle-form.js');

const mysql = require('mysql');
var mysqlcon = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "anagahez"
});
mysqlcon.connect(function(err) {
  if (err) throw err;
  console.log("Database Connected!");
  handleForm.setConnection(mysqlcon);
});



const app = express();

app.use(function (req, res) {
  res.send({ msg: "hello" });
});

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', function connection(ws, req) {
  
  
  //console.log('new user logged');
  

  //const location = url.parse(req.url, true);
  ws.on('message', function incoming(message) {
    //console.log(`received ${message}`);    
    
    //ws.send(  message );
    
    var obj = JSON.parse(message);
    
    handleReceivedObject(obj,ws);
    



    if(obj.message == 'updatePosition'){
    	newmssg = JSON.stringify(message);
    	q= `insert into test values ('',${newmssg})`;
    	//console.log(q);
    	mysqlcon.query(q,function(err,result,field){		
    	});
    }

    //console.log(JSON.parse(message));
    //console.log(typeof ws);
    for (var property in ws) {
	    	
	       //console.log(ws);
	    
	}
    
  });

  //ws.send('something');
});


function handleReceivedObject(obj,ws){
	switch(obj.formid){
		case "#loginForm":
			handleForm.loginUser(obj,function(accept,clientObject){
				ws.send(JSON.stringify(clientObject) );
			});			
		break;
	}
}


server.listen(28900, function listening() {
  console.log('Listening on %d', server.address().port);
});