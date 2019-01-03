var app = require('./app');
var debug = require('debug')('mywebsite:server');
var http = require('http');

var port = process.env.PORT || '8080';
app.set('port', port);


var server = http.createServer(app);

server.listen(port, '0.0.0.0');
