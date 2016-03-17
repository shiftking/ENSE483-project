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
connection.connect();
connection.query('SELECT * FROM health_data',function(err,rows,fields){
	if(err) throw err;
	for(var i = 0;i<rows.length;i++){
		
		console.log(rows[i].PBbpm);
	}
});
connection.end();	
var WebSocketServer = require('ws').Server;
var http = require('http');

var server = http.createServer();
var wss = new WebSocketServer({server: server, path: '/foo'});
wss.on('connection', function(ws) {
    console.log('/foo connected');
    ws.on('message', function(data, flags) {
        if (flags.binary) { return; }
        console.log('>>> ' + data);
        if (data == 'chow') { console.log('<<< he is a faggot'); ws.send('chow is a faggot'); 
				}
        if (data == 'hello') { console.log('<<< world'); ws.send('world'); }
    });
    ws.on('close', function() {
      console.log('Connection closed!');
    });
    ws.on('error', function(e) {
    });
});
server.listen(8126);
console.log('Listening on port 8126...');
