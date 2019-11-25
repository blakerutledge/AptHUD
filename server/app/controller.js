import fs from 'fs'
import path from 'path'

import { data as state } from './state'
import { tasks as state_tasks } from './state'

import * as sockets from './../components/sockets'
import * as utils from './../components/utils'

import * as weather from './../components/weather'





// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - EXPORTS

// INIT on app startup
export const build = ( http_server ) => {

	console.log('✨  Building state')

	sockets.listen( http_server )

	weather.build()




	/*
	
		to-do: add more build tasks here

	*/

}

// HANDLER to report version number
export const get_version = () => {
	return process.env.VERSION
}



// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - STATE HELPER TASKS