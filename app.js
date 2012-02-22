/**
 * Module dependencies.
 */
var http = require('http');
var util = require('util');
var fs = require('fs');
var config = require('./config');

var serverip = config.server.host;
var serverport = config.server.port;

/**
 * Create HTTP Server
 */
var server = http.createServer(function(req, res){
  req.variables = [
    { name: 'webSocketHost', value: serverip },
    { name: 'webSocketPort', value: serverport }
  ];

  var template = fs.readFileSync(__dirname + '/index.html');
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.write(template.toString());
  res.end();
});
server.listen(serverport, serverip);

/**
 * WebSocket handler
 */
var io = require('socket.io').listen(server);
var count = 0;

io.sockets.on("connection", function(socket){
  console.log("connection server established : " + ++count);  
  socket.on("message", function(data){
    console.log("on message: " + data);
    io.sockets.send(data);
  });  
  socket.on("disconnect", function(){
     // handle disconnect
     console.log("Client Disconneted: " + --count);
  });
});
console.log("app listening: http://" + serverip + ":" + serverport);

