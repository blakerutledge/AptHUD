import * as io from 'socket.io-client'

import * as home from './../sections/home'

export let socket

let status = {
	connected: false
}

export let build = () => {

	socket = io.connect()

	socket.on('refresh', () => {
		console.log('refresh')
		window.location.reload()
	})

	socket.on( 'who_are_you', () => {
		socket.emit( 'i_am', 'test' )
	})

	socket.on('welcome', ( data ) => {
		status.connected = true
		console.log( '%c socket ', 'background: #3793cf; color: #fff', { connected: status.connected, as: data } )
	})

	socket.on('disconnect', ( data ) => {
		console.log( '%c socket ', 'background: #d63845; color: #fff', { connected: status.connected } )
	})








	socket.on('event', ( data ) => {
		// do the things
	})


}

export let emit = (event, data) => {
	socket.emit(event, data)
}