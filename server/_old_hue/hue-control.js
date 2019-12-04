const jsonfile = require('jsonfile')
const hue = require("node-hue-api")
const colors = require('./colors')
const async = require('async')

let socket = require('./../socket')
let osc = require('./osc-interface')
let state = require('./state')
const utils = require('./utils')

const node_hue_api = hue.HueApi
const lightState = hue.lightState

let hueapi
let dev = true

// FIRST CONNECTION TO HUB

exports.connect = ( parent_callback ) => {
	console.log('- - - - - - - - - - - - - - -')
	console.log('- - - - - - party - - - - - -')
	console.log('- - - - - - - - - - - - - - -')
	console.log('CONNECTING TO HUE HUB')

	async.waterfall([
		(callback) => {

			hue.nupnpSearch( ( err, result ) => {
				if ( err ) { 
					callback( err, null )
				}
				else {
					state.set( 'bridge', result[ 0 ].ipaddress )
					state.set( 'found', true )
					console.log( '- - found hue:', state.bridge )
					callback( null )
				}
			} )

		},
		( callback ) => {

			let file = './config.json'
			jsonfile.readFile( file, ( err, obj ) => {
				if ( err ) { console.log( err ) }
				else {
					state.set( 'user', obj.hue.username )
					console.log( '- - trying as user:', state.user )
					callback( null )
				}
			} )

		},

		/* 

			TO-DO: register new user when none stored, and then relay info 
			to touch UI, and ask users to press the button on the hub
	
		( callback ) => {
			hueapi = new node_hue_api()
			hueapi.pressLinkButton( ( res ) => {
				console.log( res )
				 callback( null ) 
			} )
		},
		( callback ) => {
			hueapi.registerUser( config.bridge, function( err, user ) {
				if ( err ) console.log( err )
				console.log( JSON.stringify( user ) )
			})
		}, */

		( callback ) => {

			hueapi = new node_hue_api( state.bridge, state.user )
			hueapi.config().then( ( data ) => {
				console.log( '- - connected 🔥' )
				state.set( 'connected', true )
				osc.heart()
				callback( null )
			} ).done()

		}

	], ( err ) => {

		// NO hue hub found
		if ( err && ( err.code === 'ENOTFOUND' || err.code === 'ECONNREFUSED' || err.code === 'ECONNABORTED' ) ) {

			// Spoof for remote dev
			if ( dev ) {
				console.log( '- - spoofing connection 😉' )
				state.set( 'connected', 'spoofing' )
				parent_callback()
			}
			else {
				console.log('no hub found')
			}
		}

		// Unknown error ... 
		// TO-DO: authentication errors
		else if ( err ) {
			console.log('- - - error:', err.code )
		}

		// Connection successful, fetch the state
		else {
			parent_callback()
		}
	})
}


// FETCH AND FILTER SCHEMA ( rooms, scenes, lights, and current )

exports.fetch_schema = ( parent_callback ) => {

	if ( state.connected === false ) {
		return
	}
	
	console.log( 'GETTING HUE ROOMS & SCENES:', new Date().toTimeString().substr(0,8) )
	state.set( 'schema_dirty', true )

	async.waterfall([
		( callback ) => {

			if ( state.connected === true ) {
				hueapi.getFullState().then( ( data ) => {

					// TO-DO: Handle error: err.code === 'ECONNRESET'

					state.set_hue( 'raw', data )
					console.log( '- - received raw hue state' )
					callback( null )
				}).done()
			}
			else if ( state.connected === 'spoofing' ) {
				spoof.get_full_state( callback )
			}

		},
		( callback ) => {

			let groups = []
			let names = []			
			let master = {}
			let light_list = {}

			// PREP reference arrays
			for ( let i in state.hue.raw.groups ) {
				let my_lights = state.hue.raw.groups[ i ].lights
				let my_name = state.hue.raw.groups[ i ].name
				if ( !my_lights || my_lights.length > 0 && my_name ) {
					names.push( my_name )
					groups.push( my_lights )
					master[ my_name ] = []
					light_list[ my_name ] = my_lights
				}
			}
			state.set_hue( 'rooms', names )
			state.set_hue( 'light_list', light_list )

			// FILTER scenes, we only want valid, v2, non-Off scenes
			// that matches specifically to a top level group
			for ( let i in state.hue.raw.scenes ) {
				let scene = state.hue.raw.scenes[ i ]
				scene.id = i
				groups.forEach( ( group, j ) => {
					if ( state.hue.raw.scenes[ i ].version >= 2 && !state.hue.raw.scenes[ i ].locked && state.hue.raw.scenes[ i ].name !== 'Off' ) {
						if ( utils.arr_eq( state.hue.raw.scenes[ i ].lights, group ) ) {

							let scene_trim = {
								id: scene.id,
								lights: state.hue.raw.scenes[ i ].lights,
								lightstates: scene.lightstates,
								name: scene.name
							}

							master[ names[ j ] ].push( scene_trim )
						}
					}
				})
			}

			console.log( '- - sorted scenes by room' )
			state.set_hue( 'scenes', master )
			callback( null )
		},
		( callback ) => {

			// for each scene in room
			async.forEachOf( state.hue.scenes, ( scenes, i, childCallbackA ) => {
				async.forEachOf( scenes, ( scene, j, childCallbackB ) => {

					// ITERATE over lights in scene, and convert ( xy & ct ) to rgb
					if ( state.connected === true ) {
						hueapi.getScene( scene.id ).then( ( data ) => {
							state.hue.scenes[ i ][ j ].lightstates = data.lightstates
							for ( let k in state.hue.scenes[ i ][ j ].lightstates ) {
								let light = state.hue.scenes[ i ][ j ].lightstates[ k ]
								state.hue.scenes[ i ][ j ].lightstates[ k ].rgb = ( light.xy ) 
									? colors.xyb_to_rgb( light.xy[0], light.xy[1], light.bri )
									: colors.ctbri_to_rgb( light.ct, light.bri )
								state.hue.scenes[ i ][ j ].lightstates[ k ].hex = colors.rgb_to_hex( state.hue.scenes[ i ][ j ].lightstates[ k ].rgb )
							}
							childCallbackB()
						}).done()	
					}
					else if ( state.connected === 'spoofing' ) {
						spoof.get_scene_detail( scene.lights, i, j, childCallbackB )
					}

				}, ( err ) => {
					if ( err ) console.log( err )
					childCallbackA()
				})
			}, ( err ) => {
				if ( err ) console.log( err )
				console.log( '- - fetched colors for scenes' )
				callback( null )
			})

		},
		( callback ) => {
			filter_schema_osc( callback )
		},
		( callback ) => {
			osc.emit_hue_schema( callback )
		}

	], ( err ) => {

		if ( err ) {
			console.log( err )
		}
		else {
			state.set( 'schema_status', true )
			state.set( 'last_schema_fetch', new Date() )
			state.set( 'schema_dirty', false )
			exports.relay_schema()

			console.log('- - success')
			if ( parent_callback ) parent_callback ()
		}
	})

}


// FETCH & FILTER CURRENT COLOR STATE FOR EACH LIGHT

exports.fetch_lightstate = ( parent_callback ) => {

	if ( state.view === 'brightness' || state.view === 'colors' ) return
	if ( !( state.connected === true || state.connected === 'spoofing' ) ) return

	console.log( 'GETTING CURRENT LIGHTSTATE:', new Date().toTimeString().substr(0,8) )
	state.set( 'lightstate_dirty', true )

	let master = {}

	async.waterfall([
		( callback ) => {

			if ( state.connected === true ) {
				hueapi.getFullState().then( ( data ) => {

					// TO-DO: Handle error: err.code === 'ECONNRESET'
					
					state.set_hue( 'raw', data )
					console.log( '- - received raw hue state' )
					callback( null )
				}).done()
			}
		},
		( callback ) => {

			// TRIM each light's current lightstate
			let lights = state.hue.raw.lights
			for ( let i in lights ) {
				let light = lights[ i ]
				let lite = {
					id: i,
					room_name: null,
					room_index: null,
					colormode: light.state.colormode,
					reachable: light.reachable,
					hue: light.state.hue,
					bri: light.state.bri,
					ct: light.state.ct,
					on: light.state.on,
					name: light.name,
					hex: null,
					rgb: {},
					xy: []
				}

				let found_room = false
				for ( let g in state.hue.raw.groups ) {
					if ( found_room ) break
					let my_group = state.hue.raw.groups[ g ]
					let ii = my_group.lights.indexOf( i )
					if ( ii >= 0 ) {
						found_room = true
						lite.room_name = my_group.name
						lite.room_index = ii
					}
				}
				
				if ( lite.colormode === 'xy' ) {
					lite.xy = light.state.xy
					lite.rgb = colors.xyb_to_rgb( lite.xy[0], lite.xy[1], lite.bri )
					lite.hex = colors.rgb_to_hex( lite.rgb )
				}
				else if ( lite.colormode === 'ct' ) {
					// needs rgb, xy, and hex
					lite.rgb = colors.ctbri_to_rgb( lite.ct, lite.bri )
					lite.xy = colors.rgb_to_xy( lite.rgb )
					lite.hex = colors.rgb_to_hex( lite.rgb )
				}
				else {
					console.log('- - - error: unknown colormode', lite.colormode )
				}

				master[ i ] = lite
			}

			state.set_hue( 'current', master )
			console.log('- - normalized lightstate')
			callback ( null )

		},
		( callback ) => {
			filter_lightstate_osc( callback )
		},
		( callback ) => {
			osc.emit_hue_lightstate( callback )
		}
	], ( err ) => {

		if ( err ) {
			console.log( 'failed to fetch current state lightstate' )
		}
		else {
			set_brightness_group_delay()
			state.set( 'lightstate_dirty', false )
			console.log('- - success')
			if ( parent_callback ) parent_callback( null )
		}
	} )
}


// - - - FILTER SCHEMA ( ROOMS & SCENES ) DATA FOR OSC - - - - - - - - - - - - - - - - - - - - - //

let filter_schema_osc = ( callback ) => {

	console.log( '- - filter scenes & rooms for osc' )

	// Build array of strings, each string is a row in an table dat, tab delineated
	let out = []

	// For each room
	for ( let room in state.hue.scenes ) {

		// For each scene, start a new row
		let scenes = state.hue.scenes[ room ]
		scenes.forEach( scene => {

			// Room & Scene columns
			let row = [ room, scene.name ]
			
			// Add each light in rgba columns
			for ( let light in scene.lightstates ) {
				for ( let chan in scene.lightstates[ light ].rgb ) {
					let val = scene.lightstates[ light ].rgb[ chan ]
					let norm = Math.round( utils.normalize( val, 0, 255, true ) * 10000 ) / 10000 
					row.push( norm )
				}
				row.push( 1 )
			}

			// Poop out that row
			out.push( row )
		})
	}

	state.set( 'osc_schema', out )
	callback( null )

}


let filter_lightstate_osc = ( callback ) => {

	// CURRENT to osc string >> table dat
	// Room, ID, Name, hex, r, g, b
	let out = []

	for ( let light in state.hue.current ) {
		let my_light = state.hue.current[ light ]
		let row = [
			my_light.room_name,
			light,
			my_light.name,
			my_light.hex,
			utils.normalize( my_light.rgb.r, 0, 255, true ),
			utils.normalize( my_light.rgb.g, 0, 255, true ),
			utils.normalize( my_light.rgb.b, 0, 255, true ),
			1
		]
		out.push( row )
	}

	state.set( 'osc_lightstate', out )
	callback( null )

}


// - - - NETWORK - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //

exports.relay_schema = () => {
	// For DEV browser head only
	if ( socket.emit ) socket.emit( 'relay_schema', state )
}

exports.set_scene = ( _room, _scene ) => {

	let room_index = ( _room === undefined ) ? state.room_index : _room
	let scene_index = ( _scene === undefined ) ? state.hue.set_scene_index : _scene

	if ( !state.connected ) { 
		// No connection
		console.log('ERROR: cannot set scene, not connected to hue')
		return
	}
	else if ( state.room === null ) {
		// Unknown room (application boot?)
		// TO-DO: pick default room in settings
		console.log( 'ERROR: cannot set scene, unknown current room' )
		return
	}
	else if ( state.room === 'Phillip' || state.room === 'Mike' ) {
		// DEV: dont wake up roommates 
		console.log( 'BLOCKED: wont set phil or mikes room during dev' )
		return
	}

	let scene_id = state.hue.scenes[ state.room ][ scene_index ].id

	scene_bottler( () => { hueapi.activateScene( scene_id ) } )

}

// DEBOUNCE set scene  calls

let scene_bottleck = null
let scene_bottler = (fn) => {
	if ( !scene_bottleck ) {
		fn()
		scene_bottleck = setTimeout( () => { scene_bottleck = null }, 100 )
	}
}




// - - - BRIGHTNESS - - - - - - - - - - - - - - - - - - - - - - - - - - - - //

// RESET when Touch UI moves into brightness view
// so that we dont unnecessarily add on() or off() to the lightstate
exports.reset_brightness_status = () => {
	
	// TO-DO: determine if correct with ... api query or cached state test
	brightness_off = true

	start_watching_stack()
}
let brightness_off = false

exports.calc_approx_brightness = () => {
	let avg = 0
	let num = 0
	let err = false
	state.hue.light_list[ state.room ].forEach( light_id => {
		let boo = ( state.hue.current[ light_id ] && state.hue.current[ light_id ].rgb )
		let light = ( boo )
			? state.hue.current[ light_id ].rgb
			: { r: 0, g: 0, b: 0 }
		if ( !boo ) err = true
		avg += utils.normalize( ( ( light.r + light.g + light.b ) / 3 ), 0, 255, true )
		num++
	} )
	avg = avg / num

	if ( !err ) { 
		state.set_hue( 'emit_bri', avg )
		osc.emit('state/avg_bri/', [ state.hue.emit_bri ] )
	}
	else { 
		console.log( 'ERROR: in calc_approx_brightness, cant find light(s) in state.hue.current' )
	}

}

// Called at up to 60xps by Touch UI
exports.set_brightness = ( _room, _bri ) => {

	// Optional overrides, defaults to current state
	let room_index = ( _room === undefined ) ? state.room_index : _room
	let bri = ( _bri === undefined ) ? state.hue.set_bri : _bri
	
	// Error checking
	if ( !state.connected ) { 
		// No connection
		console.log('ERROR: not connected to hue, cannont set scene')
		return
	}
	else if ( state.room === null ) {
		// Unknown room (application boot?)
		// TO-DO: pick default room in settings
		console.log( 'ERROR: cannot set scene, unknown current room' )
	}
	else if ( state.room === 'Phillip' || state.room === 'Mike' ) {
		// DEV: dont wake up roommates 
		console.log( 'BLOCKED: wont set phil or mikes room during dev' )
		return
	}

	// Okay, create the state
	let zigbee_count = 0
	let new_state
	let force = false
	if ( bri === 0 && !brightness_off ) {
		new_state = hue.lightState.create().off().transition( brightness_group_transition )
		force = true
		zigbee_count = 2
	}
	else if ( bri > 0 && brightness_off ) {
		new_state = hue.lightState.create().on().transition( brightness_group_transition ).bri( bri / 100 * 255 )
		force = true
		zigbee_count = 2
	}
	else {
		new_state = hue.lightState.create().transition( brightness_group_transition ).bri( bri / 100 * 255 )
		zigbee_count = 1
	}

	// Debounce group calls to keep light_state_stack from building up too fast
	if ( force ) {
		clearTimeout( brightness_group_timer_finish )
		light_state_stack = []
		state.hue.light_list[ state.room ].forEach( light => {
			light_state_stack.push( { light: light, new_state: new_state, zigbee_count: zigbee_count } )
		})
	}
	else {
		brightness_bottleneck( () => {
			light_state_stack = []
			state.hue.light_list[ state.room ].forEach( light => {
				light_state_stack.push( { light: light, new_state: new_state, zigbee_count: zigbee_count } )
			})
		})
	}

}

// DEBOUNCE the group updates from Touch, 
// completing most recent fn on timeout

let brightness_group_delay = 42
let brightness_group_transition = 42
export let set_brightness_group_delay = () => {
	let num_lights = state.hue.light_list[ state.room ].length
	brightness_group_delay = utils.clamp( 42 * num_lights, 42, 1000 )
	brightness_group_transition = brightness_group_delay - 10
	brightness_group_transition = ( brightness_group_transition < 0 ) ? 0 : brightness_group_transition
	// console.log( 'transition: ', brightness_group_transition )
}

let brightness_group_timer = null
let brightness_group_timer_finish = null

let brightness_bottleneck = ( fn ) => {
	if ( light_state_stack.length === 0 ) {
		fn()
		clearTimeout( brightness_group_timer_finish )
	}
	else {
		clearTimeout( brightness_group_timer_finish )
		brightness_group_timer_finish = setTimeout( () => {
			fn()
			clearTimeout( brightness_group_timer_finish )
		}, brightness_group_delay )
	}
}

// LIGHTSTACK state trackers
let light_state_stack = []
let watching_stack = false
let stack_interval = 100 // ms
let stack_frame_expected

let start_watching_stack = () => {
	if ( watching_stack ) return
	watching_stack = true
	if ( dev ) sec_expected = Date.now()
	if ( dev ) fps.second()
	fps.tick_sum = 0
	stack_frame_expected = Date.now()
	peep_stack()
}
export let stop_watching_stack = () => {
	watching_stack = false
}

// Stack watcher loop, with js time drift compensation
let peep_stack = () => {
	let dt = Date.now() - stack_frame_expected // the drift

	// WOW lets actually set a light now
	if ( light_state_stack.length > 0 ) {
		let up_next = light_state_stack.shift()
		set_light_state( up_next.light, up_next.new_state, up_next.zigbee_count )
		stack_interval =  up_next.zigbee_count * 42
	}

	stack_frame_expected += stack_interval

	if ( watching_stack ) setTimeout( peep_stack, Math.max( 0, stack_interval - dt ) )
}


// SET light helper
let set_light_state = ( light, new_state, zigbee_count, callback ) => {

	hueapi.setLightState( light, new_state, ( err, results ) => {
		// TO-DO: verify conditional statement below... hard to reproduce error
		if ( err && err.type === 201 ) {
			let force_on = new_state
			force_on._values.on = true
			set_light_state( light, force_on, zigbee_count + 1 )
		}
		else { 
			if ( callback ) callback()
		}
	} )

	if ( new_state._values.on !== undefined && new_state._values.on === true ) {
		brightness_off = false
	}
	else if ( new_state._values.on !== undefined && new_state._values.on === false ) {
		brightness_off = true
	}

	fps.frame()
	fps.zigbee( zigbee_count )
}


// - - - TEST Stack calls per second - - - - - - - - - - - - - - - - - - - - //

let sec_rate = 1000
let sec_expected

let fps = {
	tick_sum: 0,
	zigbee_sum: 0,
	frame: () => { fps.tick_sum++ },
	zigbee: ( i ) => { fps.zigbee_sum = fps.zigbee_sum + i },
	second: () => {
		let dt = Date.now() - sec_expected
		
		if ( dev ) {
			if ( fps.zigbee_sum > 25 ) console.log('WOAH THERE - - - thats', fps.zigbee_sum, 'commands to the hub in one second. Slow down!') 
		}

		fps.tick_sum = 0
		fps.zigbee_sum = 0

		sec_expected += sec_rate
		if ( watching_stack ) setTimeout( fps.second, Math.max( 0, sec_rate - dt ) )
	}
}


// - - - ALL LIGHTS OFF - - - - - - - - - - - - - - - - - - - - - - - - - - - //

let light_off_stack = []

export let all_lights_off = () => {

	if ( state.view === 'brightness' || state.view === 'colors' ) return

	light_off_stack = []

	for ( let id in state.hue.current ) {
		let new_state =  hue.lightState.create().off()
		light_off_stack.push( { id: id, new_state: new_state } )
	}

	async.forEachOf( light_off_stack, ( light, i, callback ) => {
		set_light_state( light.id, light.new_state )
	}, ( err ) => {
		setTimeout( callback( null ), 40 )
	})

}





// - - - SPOOF HUE CONNECTION - - - - - - - - - - - - - - - - - - - - - - - - //

let spoof = {

	get_full_state: ( callback ) => {
		jsonfile.readFile('hue-dump.json', ( err, data ) => {
			state.set_hue( 'raw', data )
			console.log( '- - spoofed raw hue state' )
			if ( callback ) callback( null )
		})	
	},
	get_scene_detail: ( lights, i, j, callback ) => {
	
		let data = {}
		state.hue.scenes[ i ][ j ].lightstates = {}

		// Random colors!
		for ( let k in lights ) { 
			data[ k ] = { xy: null, bri: null, colormode: null, ct: null, hue: null, on: true, reachable: true }
			data[ k ].rgb = {
				r: Math.round( Math.random() * 255 ),
				g: Math.round( Math.random() * 255 ),
				b: Math.round( Math.random() * 255 )
			}
			data[ k ].hex = colors.rgb_to_hex( data[ k ].rgb )
			state.hue.scenes[ i ][ j ].lightstates[ k ] = data[ k ]
		}
		if ( callback ) callback()
	}
}