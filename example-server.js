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

function sendData(ws){
	var date = new Date();
	connection.connect();
	connection.query('SELECT * FROM health_data WHERE entryDate >= ;' + date,function(err,rows,fields){
		if(rows){
				console.log(rows.length);
			for(var i = 0;i<rows.length;i++){
				ws.send(rows[i].PBbpm +","+rows[i].SP02);
			}

			connection.end();
		}else{
			ws.send("no new data");
		}
	}

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
					setInterval(sendData(ws),2000);
				}


				});

					//var time = new Date();
					/*var new_data;
					while(!done){
						new_data = getData(time);

						for(var i = 0;i<new_data.length;i++){
							ws.send(new_data[i].PBpbm +","+new_data[i].SP02);
						}
						time = new Data();
					}*/

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
