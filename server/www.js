#!/usr/bin/env node

let path = require('path')
let app = require('./app')
let debug = require('debug')('app:server')
let http = require('http').createServer( app )
var io = require('socket.io')(http)
var chokidar = require('chokidar')
let config = require( path.join(__dirname, '..', 'config.json') )

// Create HTTP server
// Listen on provided port, on all network interfaces
let env =  process.env.PWD.includes('production') ? 'production' : 'staging'
console.log( 'Starting ' + env + ' server' )

let port = parseInt( config.port )
app.set('port', port)
http.listen(port)
http.on('error', onError)
http.on('listening', onListening)


// Start application with SocketIO
let socket = require('./socket').open(io)


// Error starting server at specified port 
function onError(error) {
  if (error.syscall !== 'listen') {
    throw error
  }
  let bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges')
      process.exit(1)
      break
    case 'EADDRINUSE':
      console.error(bind + ' is already in use')
      process.exit(1)
      break
    default:
      throw error
  }
}


// Success, server is listening at specified port 
function onListening() {
  let addr = http.address()
  let bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port
  console.log('Listening on ' + bind)
  watchFrontend()

  setTimeout( () => {
    refreshFrontend()
  }, 1000)
}

function refreshFrontend() {
  console.log('refresh frontend')
  io.sockets.in('client').emit('refresh')
}

let resizeTimer

function watchFrontend() {
  chokidar.watch( path.join(__dirname, '..', 'dist', 'public'), {ignored: /(^|[\/\\])\../}).on('all', (event, _path) => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout( () => {
        refreshFrontend()
      }, 1000)
  })
}