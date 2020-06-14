// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  IMPORTS

import Datastore from 'nedb'
import async from 'async'
import fs from 'fs'

import controller from './../app/controller'

let io



// - - - - - - - - - - - - - - - - - - - - - - -  LISTEN FOR SOCKET CONNECTIONS

export let listen = ( _io ) => {

	io = _io
	io.on('connection', ( socket ) => {

		socket.emit( 'session_id' )

		socket.on( 'session_id', ( session_id ) => {
			// controller.create_guest( socket, session_id )
		})

	})

	console.log( '⚡   socket server ready' )

}

export let broadcast = ( room, event, data ) => {
	
	io.sockets.in( room ).emit( event, data )
	
}