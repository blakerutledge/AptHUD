#!/usr/bin/env node

let app = require('./app')
let debug = require('debug')('app:server')
let http = require('http').createServer( app )
let io = require('socket.io')(http)

// Normalize a port into a number, string, or false.
let normalizePort = ( val ) => {
  let port = parseInt(val, 10)
  if (isNaN(port)) {  return val }
  if (port >= 0) {    return port }
  return false
}

// Top-level error handler
const onError = ( error ) => {
  if (error.syscall !== 'listen') { throw error }

  let bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port

  // handle specific listen errors with friendly messages
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

// Ready
let onListening = () => {
  let addr = http.address()
  let bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port
  console.log('Listening on ' + bind)
}

// READ port from config for portability
let config = require('./../config.json')
let port = normalizePort( config.port )

app.set('port', port)
http.listen(port)
http.on('error', onError)
http.on('listening', onListening)