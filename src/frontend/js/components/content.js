import { parse_images } from './../app/controller'

export let all = { 
	loaded: false
}



// - - - - - - -  - - - - - - - - - - - - - - - - - - ORGANIZE incoming content

export let store = ( data, callback ) => {

	all = data

	finish_store()

	callback()

}


let finish_store = () => {
	all.loaded = true
	console.log( 
		'%c content ', 'background: #06C7B3; color: #fff', 
		all
	)
}