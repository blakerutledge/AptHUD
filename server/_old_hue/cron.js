let later = require('later')
let hue_control = require('./hue-control')
let osc = require('./osc-interface')

const SCHEMA_INTERVAL = 20
let cur_fetch_tick = 0


module.exports = {

	config: {
		intervals: {
			heart_touch: later.parse.cron( '*/3 * * * * *', true ),
			// heart_hue: later.parse.cron( '*/1 * * * *' ),
			fetch_hue: later.parse.cron( '*/3 * * * * *', true )
		}
	},

	build: () => {
		hue_control.connect( () => {
			hue_control.fetch_schema( () => {
				hue_control.fetch_lightstate()
			})
		})

		setTimeout( () => {
			module.exports.set_tasks()
		}, 1000 * 5 )

	},

	timers: {

	},

	tasks: {

		heart_touch: () => {
			osc.heart()
		},
		heart_hue: () => {
			// console.log('heart_hue')
		},
		fetch_hue: () => {
			if ( cur_fetch_tick >= SCHEMA_INTERVAL ) {
				// FETCH schema, and then lightstate
				hue_control.fetch_schema( () => {
					hue_control.fetch_lightstate()
				})
				cur_fetch_tick = 0
			}
			else {
				// JUST FETCH lightstate
				hue_control.fetch_lightstate()
				cur_fetch_tick++
			}
		},


	},

	// Set intervals for each cron task
	set_tasks: () => {
		for ( let key in module.exports.config.intervals ) {
			let schedule = module.exports.config.intervals[ key ]
			module.exports.timers[ key ] = later.setInterval( module.exports.tasks[ key ], schedule )
		}
	}

}
