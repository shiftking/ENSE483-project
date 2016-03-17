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
var mysql = require('mysql'),pollingTimer;
var connection = mysql.createConnection({
	host:'localhost',
	user:'root',
	password:'pi_sql',
	database:'health_data'
});
connection.connect();
function sendData(ws){
	var date1 = (new Date()).toISOString().substring(0, 19).replace('T', ' ');
	var date2 = (new Date()).toISOString().substring(0, 19).replace('T', ' ');


	connection.query('SELECT * FROM health_data ORDER BY entryDate DESC LIMIT 1' ,function(err,rows,fields){
		if(rows){
				console.log(rows.length);
			for(var i = 0;i<rows.length;i++){

					ws.send();
					console.log(rows[i].PBbpm +","+rows[i].SP02+','+rows[i].entryDate);

			}


		}else{
			ws.send("no new data");
		}
		if(connectionsArray.length){
			pollingTimer = setTimeout(sendData(ws),2000);
		}
	});

};

var WebSocketServer = require('ws').Server;
var http = require('http');
var connectionsArray = [];
var server = http.createServer();
var wss = new WebSocketServer({server: server, path: '/foo'});
wss.on('connection', function(ws) {
		connectionsArray.push(ws);
    console.log('/foo connected');

    ws.on('message', function(data, flags) {
        if (flags.binary) { return; }
        console.log('>>> ' + data);
        if (data == 'update'){

						sendData(ws);

				}else if(data=="disconnect"){
					ws.close();
				}
    });
    ws.on('close', function() {
			var socketIndex = connectionsArray.indexOf(ws);
			if(socketIndex >= 0){
				connectionsArray.splice(socketIndex,1);
			}

    });
    ws.on('error', function(e) {
			var socketIndex = connectionsArray.indexOf(ws);
			if(socketIndex >= 0){
				connectionsArray.splice(socketIndex,1);
			}
    });
});

server.listen(8126);
console.log('Listening on port 8126...');
