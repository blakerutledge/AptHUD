#!/usr/bin/env node
'use strict';

var path = require('path');
var app = require('./app');
var debug = require('debug')('app:server');
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var chokidar = require('chokidar');
var config = require(path.join(__dirname, '..', 'config.json'));

// Create HTTP server
// Listen on provided port, on all network interfaces
var env = process.env.PWD.includes('production') ? 'production' : 'staging';
console.log('Starting ' + env + ' server');

var port = parseInt(config.port);
app.set('port', port);
http.listen(port);
http.on('error', onError);
http.on('listening', onListening);

// Start application with SocketIO
var socket = require('./socket').open(io);

// Error starting server at specified port 
function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }
  var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;
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
}

// Success, server is listening at specified port 
function onListening() {
  var addr = http.address();
  var bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
  console.log('Listening on ' + bind);
  watchFrontend();

  setTimeout(function () {
    refreshFrontend();
  }, 1000);
}

function refreshFrontend() {
  console.log('refresh frontend');
  io.sockets.in('client').emit('refresh');
}

var resizeTimer = void 0;

function watchFrontend() {
  chokidar.watch(path.join(__dirname, '..', 'dist', 'public'), { ignored: /(^|[\/\\])\../ }).on('all', function (event, _path) {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      refreshFrontend();
    }, 1000);
  });
}