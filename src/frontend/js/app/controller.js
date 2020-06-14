import * as THREE from 'three'

import * as utils from './../components/utils'
import { nodes } from './../components/nodes'
import * as world from './../sections/world'
import { all as routes } from './../components/routes'
import mobile from './../components/mobile'

import * as async from 'async-es'

export let is_mobile = true

export let build = () => {

	window.addEventListener( 'resize', resize_handler )

	console.log(
		'%c state ', 'background: #D865C7; color: #fff',
		state
	)

	is_mobile = mobile()

	if ( is_mobile ) {

		nodes.body.classList.add('mobile')

	}


}


let resize_handler = () => {

	sync_window_size_state()

	world.resize_handler()

}


export let sync_window_size_state = () => {

	let w = window.innerWidth // nodes.background_outer.clientWidth
	let h = window.innerHeight // nodes.background_outer.clientHeight

	state.window_size = {
		w: w,
		h: h,
		aspect: w / h,
		d: ( new THREE.Vector2( w, h ).length() ),
		px: window.devicePixelRatio,
		u_px_norm: new THREE.Vector2( w, h ),
		aspect_vec: new THREE.Vector2( 1.0, w / h ),
		x: 0,
		y: 0,
		u: 1.0 / w,
		v: 1.0 / h,
	}
	
}


export let sync_body_class = ( template ) => {

	for ( let t in routes ) {
		nodes.body.classList.remove( `section-${ t }` )
	}

	nodes.body.classList.add( `section-${ template }` )

}

// SIMPLE state object for tracking certain states across the app

export let state = {

	is_mobile: false,
	
	window_size: {}

}