#!/usr/bin/env node

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  IMPORTS

const dotenv = require('dotenv').config('./../.env')
const debug = require('debug')('app:server')
const http = require('http')

let app = require('./app/index')
let controller = require('./app/controller')



// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  VALIDATE .env

const valid = (
			process.env.NODE_ENV 					!== undefined
	&&		process.env.PORT 						!== undefined
	&&		process.env.DARKSKY_SECRET_KEY			!== undefined
)

if ( !valid ) {
	console.log( 'Incomplete .env file.' )
	console.log( 'Reference .env.example file and add missing entries.' )
	process.exit(1)
}



// - - - - - - - - - - - - - - - - - - - - - - - - - Helpers and Event handlers

// Normalize port to number helper
const normalizePort = ( val ) => {
	let port = parseInt(val, 10)
	if (isNaN(port))						{ return val  }
	if (port >= 0) 	 						{ return port }
	return false
}

// Top-level error handler
const onError = ( error ) => {
	if ( error.code === 'EADDRINUSE' ) {
		console.error( 'Port ' + port + ' is already in use' )
		process.exit(1)
	}
	if ( error ) 							{ throw error }
}

// Ready handler
const onListening = () => {
	let p = process.env.PORT
	console.log( '📡  ' + process.env.NODE_ENV + ' server listening on port ' + p )

	controller.build( http_server )

}



// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - BUILD server

let port = normalizePort( process.env.PORT )
let http_server = http.createServer( app )

http_server.on( 'listening', onListening )
http_server.on( 'error', onError )
http_server.listen( port )
app.set( 'port', port )