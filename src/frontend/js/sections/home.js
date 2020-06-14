import { build as nodes_build } from './../components/nodes'
import * as world from './world'
import { nodes } from './../components/nodes'
import * as utils from './../components/utils'
import * as controller from './../app/controller'

import * as navigation from './../components/navigation'
import * as templates from './../components/templates'
import { all as content } from './../components/content'

let status = {
	init: false
}

export let build = () => {

	// COLLECT nodes within template
	nodes_build( 'home' )

	if ( !status.init ) {

		controller.sync_window_size_state()

		world.build_world()

	}

	status.init = true
	
}


// USED when an non-top level page is navigated to directly

export let pre_build = () => {

	if ( !status.init ) {

		controller.sync_window_size_state()

		nodes_build( 'home' )

		world.build_world()

	}

	status.init = true

}