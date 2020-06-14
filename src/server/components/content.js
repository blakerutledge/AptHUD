import * as jsonfile	from 'jsonfile'
import async	 		from 'async'
import path  			from 'path'
import fs  				from 'fs-extra'
import nodefetch		from 'node-fetch'

import * as utils 		from './utils' 





// - - - - - - - - - - - - - - - - - - - - - - - - - GENERIC master json content


export let data = {}


export let store = ( d ) => {

	// Write content json to disk
	let json_path = path.join( 'data', 'content.json' )
	jsonfile.writeFile( json_path, d, { spaces: 2 }, () => {
		console.log('💫  Updated content json')
	})

	data = d

}


export let build = () => {

	// TO-DO: ya know, get your content from somewhere
	let d = {
		hello: 'world'
	}

	store( d )

}