import * as controller from './../app/controller'
import { build as nodes_build } from './../components/nodes'
import { nodes as nodes } from './../components/nodes'
import * as socket from './../components/socket'
import * as utils from './../components/utils'
import * as world from './world'


export let build = () => {

	// COLLECT nodes within template
	nodes_build( 'page1' )

	

}