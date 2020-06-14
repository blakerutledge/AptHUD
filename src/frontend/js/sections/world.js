import * as THREE from 'three'
import { gsap } from 'gsap'

import { nodes } from './../components/nodes'
import * as utils from './../components/utils'
import { state, sync_window_size_state } from './../app/controller'
import { all as content } from './../components/content'

import generic_frag from './../../glsl/generic/frag.glsl'
import generic_vert from './../../glsl/generic/vert.glsl'


// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  THREE WORLD

let config = {
	frustrum: 10
}

export let world = {}	

export let uniforms = {
	generic: {
		u_time: { value: 0 },
		u_resolution: { value: [ 0, 0 ] },
		u_mouse: { value: [ 0, 0 ] }
	}
}

export let build_world = () => {

	world.active = true

	world.renderer = new THREE.WebGLRenderer( { alpha: true, antialias: true } )
	world.clock = new THREE.Clock()
	world.renderer.setSize( state.window_size.w, state.window_size.h )

	nodes.world.appendChild( world.renderer.domElement )

	world.scene = new THREE.Scene()
	world.ortho = new THREE.OrthographicCamera( 
		config.frustrum * state.window_size.aspect / -2, 
		config.frustrum * state.window_size.aspect /  2, 
		config.frustrum /  2, 
		config.frustrum / -2, 
		-10000,
		10000
	)

	world.persp = new THREE.PerspectiveCamera( 30, state.window_size.w / state.window_size.h, 1, 1000 );
	world.persp.position.z = 5.0;
	gsap.ticker.add( update )

	build_scene()

	document.addEventListener( 'mousemove', mouse_move, { passive: true } )
	document.addEventListener( 'drag', mouse_move, { passive: true } )

}


let build_scene = () => {

	world.objects = {}

	init_generic()

}



let init_generic = () => {


	// - - - VISUALIZATION

	let viz_shader = new THREE.ShaderMaterial( {
		uniforms: uniforms.generic,
		vertexShader: generic_vert,
		fragmentShader: generic_frag,
		transparent: false
	} )

	// background
	let geo = new THREE.PlaneBufferGeometry( 1.0, 1.0 )
	let msh = new THREE.Mesh( geo, viz_shader )
	msh.scale.x = config.frustrum * state.window_size.aspect
	msh.scale.y = config.frustrum
	msh.position.z = -100
	world.objects.bg = msh
	world.scene.add( world.objects.bg )

}


export let mouse = {
	norm: new THREE.Vector2(),
	px: new THREE.Vector2()
}


let mouse_move = ( e ) => {

	let m = {
		x: 0,
		y: 0
	}

	if ( e.clientX !== undefined && e.clientY !== undefined ) {
		m.x = e.clientX
		m.y = e.clientY
	}
	else if ( e.x !== undefined && e.y !== undefined ) {
		m.x = e.x + state.window_size.x
		m.y = e.y + state.window_size.y
	}
	else {
		console.error( 'bad mousemove input:', e )
	}

	// PIXEL coords limited to webgl canvas
	mouse.px.x = utils.clamp( m.x - state.window_size.x, 0, state.window_size.w )
	mouse.px.y = utils.clamp( m.y - state.window_size.y, 0, state.window_size.h )

	// NORMALIZED, -1 to 1 in both dimensions
	mouse.norm.x =  1 * ( ( m.x - state.window_size.x ) / state.window_size.w * 2 - 1 )
	mouse.norm.y = -1 * ( ( m.y - state.window_size.y ) / state.window_size.h * 2 - 1 )

	// CLAMP, only after testing for mouse.hover_world
	mouse.norm.x = utils.clamp( mouse.norm.x, -1, 1 )
	mouse.norm.y = utils.clamp( mouse.norm.y, -1, 1 )

}



// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  UPDATE HANDLERS

let update = ( time, deltaTime, frame ) => {


	if ( !world.active ) return


	// - - - TIME

	world.clock.frame_delta = world.clock.getDelta()


	if ( world.objects && world.objects.bg ) {

		uniforms.generic.u_time.value += world.clock.frame_delta

		if ( state.window_size ) {
			uniforms.generic.u_resolution.value = [ state.window_size.w, state.window_size.h ]
		}
		
		uniforms.generic.u_mouse.value = [ mouse.norm.x, mouse.norm.y ]

	}


	render()

}


let render = () => {
	world.renderer.render( world.scene, world.ortho )
}


export let resize_handler = () => {
	world.renderer.setSize( state.window_size.w, state.window_size.h )
	if ( world.objects.plane ) {
		world.objects.plane.scale.x = config.frustrum * state.window_size.aspect
		world.objects.plane.scale.y = config.frustrum
	}
	if ( world.objects.bg ) {
		world.objects.bg.scale.x = config.frustrum * state.window_size.aspect
		world.objects.bg.scale.y = config.frustrum
	}
	update_ortho()
	update_persp()
}


let update_ortho = () => {

	if ( world.ortho === undefined ) return
	
 	world.ortho.left = 		config.frustrum * state.window_size.aspect / -2
	world.ortho.right =  	config.frustrum * state.window_size.aspect /  2
	world.ortho.top = 		config.frustrum /  2
	world.ortho.bottom =	config.frustrum / -2

	world.ortho.updateProjectionMatrix()
}


export let update_persp = () => {
	
	if ( world.persp === undefined ) return
	
	world.persp.aspect = state.window_size.aspect

	world.persp.updateProjectionMatrix()

}