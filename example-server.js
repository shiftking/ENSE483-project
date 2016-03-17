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
function getData(Date currDate){
	var data;
	connection.query('SELECT * FROM health_data WHERE enrtyData > '+currDate,function(err,rows,fields){
		data = rows;
	});
	return data;
;}
connection.end();
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
        if (data == 'connect'){
					var time = new Date();
					var new_data;
					while(!done){
						new_data = getData(time);
						for(var i = 0;i<new_data.length;i++){
							ws.send(new_data[i].PBpbm +","+new_data[i].SP02);
						}
						time = new Data();
					}
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
