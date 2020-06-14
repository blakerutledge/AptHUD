import * as content from './content'
import { build as home_build } from './../sections/home'
import { build as page1_build } from './../sections/page1'
import { build as page2_build } from './../sections/page2'


// Update this with all category template distributions
export let all = {
	'home': {
		template: 'home',
		data: 'all.content'
	},
	'page1': {
		template: 'page1',
		data: 'all.content'
	},
	'page2': {
		template: 'page2',
		data: 'all.content'
	}
}


// Update this with content structure
export let tree = [
	[ 'home', 'page1', 'page2' ]
]

export let section_builders = {
	'home': home_build,
	'page1': page1_build,
	'page2': page2_build
}


// Helpers be helpin'

export let get_template = ( path ) => {
	return ( all[ path ] ) 
		? all[ path ].template
		: '404'
}

export let get_data = ( path, query ) => {

	if ( all[ path ] === undefined ) {
		return content.all
	}

	let temp = content
	let data_str = all[ path ].data
	let arr = data_str.split('.')

	arr.forEach( x => {
		temp = temp[ x ]
	})

	if ( query ) {
		temp = temp[ query ]
		temp.title = query
	}

	return temp
}