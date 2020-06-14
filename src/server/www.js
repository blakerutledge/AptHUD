#!/usr/bin/env node

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  IMPORTS

import path from'path'
import dotenv from'dotenv'
dotenv.config( './../../.env' )

import http from'http'
import socketio from'socket.io'
import chokidar from'chokidar'

import app from'./app/index.js'
import * as sockets from'./components/sockets'



// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  VALIDATE .env

const valid = (
			process.env.NODE_ENV                   	!== undefined
	&&		process.env.PORT                        !== undefined
	&& 		process.env.DARKSKY_SECRET_KEY			!== undefined
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
	console.log( '📡  web server listening on port ' + p )

	if ( process.env.NODE_ENV === 'dev' ) watch_frontend()
}



// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - BUILD server

let port = normalizePort( process.env.PORT )
let http_server = http.createServer( app )
let io = socketio( http_server )

http_server.on( 'listening', onListening )
http_server.on( 'error', onError )
http_server.listen( port )
app.set( 'port', port )



// - - - - - - - - - - - - - - - - - - - - - - - - - - - - BUILD socket module

sockets.listen( io )

let refresh_timer

let watch_frontend = () => {

	chokidar.watch( path.join( 'frontend' ), {
		cwd: path.join( 'dist' ),
		ignored: [ 'frontend/assets/*' ] }
	).on( 'all', ( event, filepath ) => {
		clearTimeout( refresh_timer )
		refresh_timer = setTimeout( refresh_frontend, 1000 )
	})
}

let refresh_frontend = () => {
	console.log( 'refresh frontend' )
	io.sockets.in( 'client' ).emit( 'refresh' )
}