let Datastore = require('nedb')
let async = require('async')
let fs = require('fs')
let io


// - - - Incoming Events & Handlers from Socket - - - //

let client_handlers = (socket) => {

	// On the event...
	socket.on('event', (data) => {
		// ... do the things
	})







	// Defaults

	socket.join('client')
	console.log('client has joined')

	socket.emit('welcome', 'client')
	
	socket.on('disconnect', function () {
		console.log('client has left')
	})

}


// Add types of clients, if multiple
exports.clients = {
	'client': client_handlers
}


// - - - Incoming Connection - - - //

exports.open = (_io) => {

	io = _io

	// Begin a connection
	io.on('connection', (socket) => {

		// Who are you?
		socket.emit('who_are_you')

		socket.on('i_am', (data) => {
			if (  
				exports.clients[ data ] !== undefined 
				&& typeof exports.clients[ data ] === 'function' ) 
		
				{ 
					exports.clients[ data ](socket) 
				}

			else {

				console.log('Client provided invalid or nonexistant client key')
				socket.disconnect()

			}
		})

	})

    return io
}

