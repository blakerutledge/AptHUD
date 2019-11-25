#!/usr/bin/env node

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  IMPORTS

import dotenv from 'dotenv'
import debug from 'debug'
import http from 'http'

import app from './app/index'
import * as controller from './app/controller'

dotenv.config('./../.env')
debug.debug('app:server')


// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  VALIDATE .env

const valid = (
			process.env.ENV 						!== undefined
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
const normalize_port = ( val ) => {
	let port = parseInt(val, 10)
	if (isNaN(port))						{ return val  }
	if (port >= 0) 	 						{ return port }
	return false
}

// Top-level error handler
const on_error = ( error ) => {
	if ( error.code === 'EADDRINUSE' ) {
		console.error( 'Port ' + port + ' is already in use' )
		process.exit(1)
	}
	if ( error ) 							{ throw error }
}

// Ready handler
const on_listening = () => {
	let p = process.env.PORT
	console.log( '📡  ' + process.env.ENV + ' server listening on port ' + p )

	controller.build( http_server )

}



// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - BUILD server

let port = normalize_port( process.env.PORT )
let http_server = http.createServer( app )

http_server.on( 'listening', on_listening )
http_server.on( 'error', on_error )
http_server.listen( port )
app.set( 'port', port )