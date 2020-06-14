import date_me from './date-me'
import templates from './templates'
import * as utils from './utils'
import * as ajax from './ajax'
import * as content from './content'
import * as routes from './routes'
import transitions from './transitions'
import * as controller from './../app/controller'

import { pre_build as home_pre_build } from './../sections/home'

// Section triggers
import * as home from './../sections/home'


export let status = {
	init: false,
	current: null,
	previous: null,
	uid: 0,
	reverse: false,
	direction: ''
}

// - - - status.direction options - - - //

/*
	in -> lower, into the tree
	flat -> same branch
	out -> higher, out of the tree 
*/


export let build = function() {

	// Add Back/Forward button listener
	window.addEventListener('popstate', function(e) {
		
		// Parse URL request, set base to home
		let _url = (e !== undefined && e.state !== null && e.state !== undefined )
			? e.state.path
			: null
		_url = (_url===null) 
			? 'home' 
			: _url.replace(/^.*\/\/[^\/]+/, '')

		// Test if reversing
		if (window.history.state !== null) {
			status.reverse = (window.history.state.uid < status.uid)
				? true
				: false
			status.uid = window.history.state.uid
		}

		status.previous = status.current
		status.current = _url

		// Pass along to router
		route( _url )
	})

}


// - - - Handle an internal link click - - - //

export let link_click = ( el, _link ) => {

	let link = ( el ) 
		? el.dataset.link
		: _link

	if (status.current === link ) {
		// Same page, do nothing
	}
	else {
		// Update status tracker
		status.previous = status.current
		status.current = link

		// Update browser history
		let state = { path: link, uid: window.history.length + 1 }
		let pretty = ( link === 'home' ) ? '' : link + '/'
		window.history.pushState(
			state,
			null,
			window.location.origin + '/' + pretty )

		status.uid = window.history.state.uid
		status.reverse = false

		// Off to the router
		route(link)
	}
}



// - - - Handle an external link click - - - //

export let external_link_click = (el) => {

	let link = el.dataset.external
	window.open( link, '_blank' )

}


// - - - Test path and redirect - - - //

export let locate = () => {

	// Get window location and strip file extension and leading slash
	let path = window.location.pathname
	path = path.replace(path.match(/\.[0-9a-z]+$/i), '')

	//Trim leading and trailing slashes
	if (path[0] === '/')
		path = path.substr(1, path.length - 1)
	if (path[ path.length - 1 ] === '/') 
		path = path.substr(0, path.length - 1)

	// Reset if home
	path = ( path === '' ) ? 'home' : path

	status.current = path

	// Nav away!
	route( path )
}


// - - - Test for direction of navigation - - - //

export let wayfind = () => {

	let cur_branch = 0
	let pre_branch = 0

	if ( status.previous === null ) {
		status.direction === 'flat'
		return
	}

	for ( let i=0; i<routes.tree.length; i++) {
		if ( routes.tree[i].indexOf( status.current ) !== -1 )
			cur_branch = i
		if ( routes.tree[i].indexOf( status.previous ) !== -1 )
			pre_branch = i
	}

	if 		( pre_branch > cur_branch ) { status.direction = 'out'  }
	else if ( pre_branch < cur_branch ) { status.direction = 'in'   }
	else 								{ status.direction = 'flat' }
}


// - - - Manage the router to handle content vs page driven urls - - - //

export let route = ( url ) => {

	let data = {
		json: '',
		template: '',
		query: '',
		el: '.container',
		motion: transitions.map( status.previous, status.current )
	}

	// Test for url as page
	let template_str = url.replace(/\//g, '.')

	if ( templates[template_str] !== undefined ) {
		// Path exists as page
		data.template = template_str
		data.json = routes.get_data( template_str )
	}
	else {
		// Path is dynamic
		let _url = url.split('/')
		let template = routes.get_template( _url[_url.length-2] )
		data.query = _url[_url.length-1]

		let href = window.location.href
		data.json = routes.get_data( _url[_url.length-2], _url[_url.length-1] )
		
		if ( Object.keys(templates).indexOf(template) === -1)
			console.error('category template not found')

		data.template = template
	}

	// Nav away!
	to( data )
}


// - - - Render new template and trigger motion - - - //

export let to = ( data ) => {

	// Wayfind
	wayfind()

	// DESTROY old container-inners (naving faster than transitions)
	let c = utils.qsa('.container-inner')
	if ( c.length > 1 ) {
		for ( let i=0; i<c.length-1; i++ ) {
			c[ i ].remove()
		}
	}
	else if ( c.length == 1 ) {
		c[ 0 ].classList.add('animate-out')
	}

	// Build & Insert new content, hidden
	let _new = document.createElement('div')
	_new.classList.add('animate-in','container-inner')
	_new.innerHTML = templates[data.template](data.json)
	let _parent = document.querySelector( data.el )
	let _old = ( _parent.children.length > 0 ) ? _parent.children[0] : null
	_parent.appendChild( _new )

	// CALL section-specific build fn
	if ( !status.init && data.template !== 'home' ) {
		home_pre_build()
	}
	if ( typeof routes.section_builders[ data.template ] === 'function' ) {
		routes.section_builders[ data.template ]( data.json )
	}
	else {
		console.log( 'no builder for', data.template  )
	}


	// Animate into place
	if ( data.motion ) {
	
		let tl = transitions.init()

		transitions[ data.motion ]( tl, _parent, _old, _new, () => { 
		
			if ( _old ) _old.remove()

			controller.sync_body_class( data.template )

		} )

		transitions.start()

	}
	else {
		transitions.default(_parent, _old, _new, () => { 
			
			if ( _old ) _old.remove()

			controller.sync_body_class( data.template )

		})
	}

	status.init = true
	
}


// - - - Add link click handlers on new content - - - //

export let links_add = (el) => {

	date_me()

	let new_links = Array.prototype.slice.call(document.querySelectorAll('[data-link]'))

	new_links.forEach( x => {
		x.addEventListener('click', () => {
			link_click(x)
		})
	})

	let new_externals = Array.prototype.slice.call(document.querySelectorAll('[data-external]'))

	new_externals.forEach( x => {
		x.addEventListener('click', () => {
			external_link_click(x)
		})
	})

}
