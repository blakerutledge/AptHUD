// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  IMPORTS

const socketio = require('socket.io')
let controller = require('./../app/controller')

let io



// - - - - - - - - - - - - - - - - - - - - - - -  LISTEN FOR SOCKET CONNECTIONS

exports.listen = ( http_server ) => {

	io = socketio( http_server )

	console.log( '⚡️  ' + process.env.NODE_ENV + ' socket server ready' )


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