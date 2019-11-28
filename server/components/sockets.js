// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  IMPORTS

import socketio from 'socket.io'

import * as controller from './../app/controller'

let io



// - - - - - - - - - - - - - - - - - - - - - - -  LISTEN FOR SOCKET CONNECTIONS

export let listen = ( http_server ) => {

	io = socketio( http_server )

	console.log( '⚡️  ' + process.env.ENV + ' socket server ready' )


	io.on('connection', ( socket ) => {

		socket.emit( 'who_are_you' )

		socket.on( 'disconnect', ( the_data ) => {
			console.log( 'a user disconnected' )
		})

		socket.on( 'i_am', ( data ) => {
			if ( data === 'client' ) socket.emit( 'welcome', 'client' )
		})

		socket.on( 'the_event', ( the_data ) => {
			// do the thing
		})

	})
}