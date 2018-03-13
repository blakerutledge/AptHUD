#!/usr/bin/env node
'use strict';

var app = require('./app');
var debug = require('debug')('app:server');
var http = require('http').createServer(app);
var io = require('socket.io')(http);

// Normalize a port into a number, string, or false.
var normalizePort = function normalizePort(val) {
  var port = parseInt(val, 10);
  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};

// Top-level error handler
var onError = function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
};

// Ready
var onListening = function onListening() {
  var addr = http.address();
  var bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
  console.log('Listening on ' + bind);
};

// READ port from config for portability
var config = require('./../config.json');
var port = normalizePort(config.port);

app.set('port', port);
http.listen(port);
http.on('error', onError);
http.on('listening', onListening);