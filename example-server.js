/*
  Prerequisites:

    1. Install node.js and npm
    2. npm install ws

  See also,

    http://einaros.github.com/ws/

  To run,

    node example-server.js
*/

"use strict"; // http://ejohn.org/blog/ecmascript-5-strict-mode-json-and-more/
var mysql = require('mysql');
var connection = mysql.createConnection({
	host:'localhost',
	user:'root',
	password:'pi_sql',
	database:'health_data'
});

function sendData(){
	var date = new Date();
	connection.connect();
	connection.query('SELECT * FROM health_data WHERE entryDate >= ;' + date,function(err,rows,fields){
		if(rows){
				console.log(rows.length);
			for(var i = 0;i<rows.length;i++){
				wss.send(rows[i].PBbpm +","+rows[i].SP02);
			}


		}else{
			wss.send("no new data");
		}
		connection.end();
	});

};

var WebSocketServer = require('ws').Server;
var http = require('http');

var server = http.createServer();
var wss = new WebSocketServer({server: server, path: '/foo'});
wss.on('connection', function(ws) {
    console.log('/foo connected');
		var done = false;
    ws.on('message', function(data, flags) {
        if (flags.binary) { return; }
        console.log('>>> ' + data);
        if (data == 'update'){
					setInterval(sendData(),5000);
				}else if(data=="disconnect"){
					ws.close();
				}
    });
    ws.on('close', function() {
      done = true;
    });
    ws.on('error', function(e) {
			done = true;
    });
});

server.listen(8126);
console.log('Listening on port 8126...');
