

module.exports = {

	// key status flags
	found: false,
	connected: false,
	schema_status: false,
	schema_dirty: true,
	light_status: false,
	lightstate_dirty: true,

	// cron
	last_schema_fetch: null,
	last_lightstate_fetch: null,

	// session
	bridge: null,
	user: null,

	// hue state
	hue: {
		raw: {},
		rooms: [],
		light_list: {},
		scenes: {},
		current: {},
		set_scene_index: 0,
		set_bri: 0,
		emit_bri: null
	},

	// nav
	view: 'ambient',
	view_index: 0,
	view_options: [ 'ambient', 'home', 'brightness', 'rooms', 'colors' ],
	'room': 'Blake',
	room_index: 0,

	osc_schema: [],
	osc_lightstate: [],


	set: ( prop, val ) => {
		if ( prop in module.exports ) { 
			module.exports[ prop ] = val
		}
		else { console.log('cannot set ', prop, ', not found in state object') }
	},

	set_hue: ( prop, val ) => {
		if ( prop in module.exports.hue ) { 
			module.exports.hue[ prop ] = val
		}
		else { console.log('cannot set hue', prop, ', not found in state object') }
	}

}