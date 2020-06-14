import { data as state } from './state'
import { tasks as state_tasks } from './state'

import * as sockets from './../components/sockets'
import * as utils from './../components/utils'
import * as content from './../components/content'

import * as weather from './../components/weather'





// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - EXPORTS

// INIT on app startup
export let build = () => {

	console.log( '🎉  Starting controller' )

	content.build()

	weather.build()

}

// HANDLER to report version number
export let get_version = () => {
	return process.env.VERSION
}