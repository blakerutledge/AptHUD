let hue_control = require('./hue-control')
let state = require('./state')

let nircmd = require('nircmd')

let osc


// - - - OSC NETWORKING - - - - - - - - - - - - - - - - - - - - - - - - - - //

exports.start = ( _osc, callback ) => {

	osc = _osc
	osc.on("ready", () => {
		console.log( 'OSC: listening over UDP on port ' + osc.options.localPort )
		if ( callback ) callback()
	})

	osc.on("message", ( message ) => {
		filter( message )
	})

	osc.open()

}


let filter = ( message ) => {
	if ( message.address === '/CURRENT_ROOM_INDEX' ) {
		state.set( 'room_index', message.args[ 0 ] )
		state.set( 'room', state.hue.rooms[ state.room_index ] )

		hue_control.set_brightness_group_delay()
		hue_control.calc_approx_brightness()
		console.log('ROOM:', state.room )
	}
	else if ( message.address === '/CURRENT_VIEW_INDEX' ) {
		// Leaving brightness view handler
		if ( state.view === 'brightness' && state.view_options[ message.args[ 0 ] ] !== 'brightness' ) {
			hue_control.stop_watching_stack()
		}

		state.set( 'view_index', message.args[ 0 ] )
		state.set( 'view', state.view_options[ state.view_index ] )
		console.log('VIEW:', state.view )

		// Entering brightness view handler
		if ( state.view === 'brightness' ) {
			hue_control.reset_brightness_status()
		}
	}
	else if ( message.address === '/SET_SCENE_INDEX' ) {
		state.set_hue( 'set_scene_index', message.args[ 0 ] )
		console.log('SCENE:', state.hue.set_scene_index )
		hue_control.set_scene()
	}
	else if ( message.address === '/SET_BRIGHTNESS' ) {
		state.set_hue( 'set_bri', message.args[ 0 ] )
		hue_control.set_brightness()
	}
	else if ( message.address === '/SLEEP_DISPLAY' ) {
		nircmd( 'nircmd.exe monitor off').then( () => {} )
	}
	else if ( message.address === '/ALL_LIGHTS_OFF' ) {
		if ( message.args[ 0 ] ) hue_control.all_lights_off()
	}
	else if ( message.address === '/_samplerate' ) { }
	else {
		// Unexpected OSC event
		console.log( 'Unexpected OSC event:', message.address, message.args, 'random:', Math.random() )
	}
}




exports.emit_hue_schema = ( callback ) => {

	console.log( '- - send scenes & rooms via osc' )

	if ( state.osc_schema.length <= 0 ) {
		console.log('cannot send schema OSC, no data')
		return
	}

	exports.emit( 'state/room_list/', state.hue.rooms )
	state.osc_schema.forEach( ( scene, i ) => {
		exports.emit( 'state/scenes/', scene )

		if ( i === state.osc_schema.length - 1 ) {
			exports.emit( 'state/scenes/over/', 1 )
			setTimeout( () => {
				exports.emit( 'state/scenes/over/', 0 )
			}, 200 )
		}
	})

	if ( callback ) callback( null )

}

exports.emit_hue_lightstate = ( callback ) => {

	console.log( '- - send lightstate via osc' )

	if ( state.osc_lightstate.length <= 0 ) {
		console.log('cannot send lightstate via OSC, no data')
		return
	}

	state.osc_lightstate.forEach( ( light, i ) => {
		exports.emit( 'state/lightstate/', light )

		if ( i === state.osc_lightstate.length - 1 ) {
			exports.emit( 'state/lightstate/over/', 1 )
			setTimeout( () => {
				exports.emit( 'state/lightstate/over/', 0 )
			}, 200 )
		}
	})

	if ( callback ) callback( null )

}


exports.emit = ( addr, args ) => {
	osc.send({ address: '/hue-relay/' + addr, args: args }, "127.0.0.1", 2998 )
}


exports.heart = () => {
	let val = state.connected ? 1 : 0
	osc.send({ address: '/hue-relay/heart/', args: val }, "127.0.0.1", 2998 )
	setTimeout( () => {
		osc.send({ address: '/hue-relay/heart/', args: 0 }, "127.0.0.1", 2998 )
	}, 100 )
}