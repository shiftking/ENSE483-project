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
//var express = require('express');
var fs = require('fs');
var url = require('url');

var connection = mysql.createConnection({
	host:'localhost',
	user:'root',
	password:'pi_sql',
	database:'health_data'
});

connection.connect();
function sendData(ws){

	var date = (new Date()).toISOString().substring(0, 19).replace('T', ' ');


	connection.query('SELECT * FROM health_data WHERE entryDate >= "'+ date +'" LIMIT 1',function(err,rows,fields){
		if(rows){
				//console.log(rows.length);
			for(var i = 0;i<rows.length;i++){

					ws.send(rows[0].PBbpm.toString());
					console.log(rows[0].PBbpm);

			}


		}else{
			ws.send("no new data");
		}
		if(connectionsArray.length){
			pollingTimer = setTimeout(sendData(ws),3000);
		}
	});

};

var WebSocketServer = require('ws').Server;
var http = require('http');
var connectionsArray = [];
var ws_server = http.createServer();
http.createServer(function(request, response) {
	// Parse the request containing file name
   var pathname = url.parse(request.url).pathname;

   // Print the name of the file for which request is made.
   console.log("Request for " + pathname + " received.");

   // Read the requested file content from file system
   fs.readFile(pathname.substr(1), function (err, data) {
      if (err) {
         console.log(err);
         // HTTP Status: 404 : NOT FOUND
         // Content Type: text/plain
         response.writeHead(404, {'Content-Type': 'text/html'});
      }else{
         //Page found
         // HTTP Status: 200 : OK
         // Content Type: text/plain
         response.writeHead(200, {'Content-Type': 'text/html'});

         // Write the content of the file to response body
         response.write(data.toString());
      }
      // Send the response body
      response.end();
   });
}).listen(8081);

var wss = new WebSocketServer({server: ws_server, path: '/foo'});
wss.on('connection', function(ws) {
		connectionsArray.push(ws);
    console.log('/foo connected');

    ws.on('message', function(data, flags) {
				var date1 = (new Date()).toISOString().substring(0, 19).replace('T', ' ');
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
			ws.close();
    });
});

ws_server.listen(8126);
console.log('Listening on port 8126...');
