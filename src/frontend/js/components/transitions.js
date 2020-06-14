import { gsap, CustomEase, SteppedEase, DrawSVGPlugin, Power2 } from 'gsap'
gsap.registerPlugin( CustomEase, SteppedEase, DrawSVGPlugin )

import * as THREE from 'three'

import { state, reset_scroll } from './../app/controller'
import * as utils from './utils'
import { nodes } from './nodes'
import * as lazyload from './lazyload'
import * as navigation from './navigation'
import * as world from './../sections/world' 


// - - - Default & Custom transitions between pages - - - //

let eases = {
	zip_out: CustomEase.create("custom", "M0,0 C0.3,0 0.3,1 1,1"),
	zip_in: CustomEase.create("custom", "M0,0,C0.4,0,0.2,1,1,1")
}

let config = {
	views: [ null, 'home', 'page1', 'page2' ]
}

export let status = {
	transitioning: false,
	active_tl: null
}

let t = 1 / 60



let transitions = {


	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  META

	map: ( _f, _t ) => {

		let f = ( _f ) ? _f.split( '/' )[ 0 ] : null
		let t = _t.split( '/' )[ 0 ]
		let action = `from_${ f }_to_${ t }`
		if ( transitions[ action ] !== undefined ) {
			return action
		}
		else {
			console.error( 'cant find transition: "' + action + '". Using default' )
			return 'default'
		}
	},

	init: () => {

		if ( status.transitioning && status.active_tl ) {
			transitions.end_early()
		} 

		let tl = new gsap.timeline({
			paused: true,
			onStart: () => {
				
			},
			onComplete: () => {

				lazyload.update()
				navigation.links_add()
					
				transitions.end()

			}
		} )

		status.transitioning = true
		status.active_tl = tl

		return tl

	},

	end_early: () => {
		status.active_tl.progress( 1 ).pause()
	},

	end: () => {
		status.active_tl.invalidate()
		status.active_tl.clear()
		status.active_tl.kill()
		status.active_tl = null
		status.transitioning = false
	},

	start: () => {
		status.active_tl.play( 0 )
	},

	default: (tl, _parent, _old, _new, callback ) => {

		// console.log( 'default transition' )

		// Animate out
		if ( _old !== null ) _old.remove()
		lazyload.update()
		navigation.links_add()

		if ( callback ) callback()
	},

	



	// - - - - - - - - - - - - - - - - - - - - - - - - - - - ANIMATE OUT AND IN

	from_null_to_home: ( tl, _parent, _old, _new, callback ) => {
			
		tweens.add_home_in( tl, 0 )

	},

	from_null_to_page1: ( tl, _parent, _old, _new, callback ) => {

		tweens.add_page1_in( tl, 0 )

	},

	from_null_to_page2: ( tl, _parent, _old, _new, callback ) => {
			
		tweens.add_page2_in( tl, 0 )

	},


	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  INDIRECT LINKS

	from_home_to_page1: (tl, _parent, _old, _new, callback ) => {
		
		tweens.add_home_out( tl, 0 )
		tweens.add_page1_in( tl, t * 45 )
	
	},

	from_page1_to_home: (tl, _parent, _old, _new, callback ) => {

		tweens.add_page1_out( tl, 0 )
		tweens.add_home_in( tl, t * 45 )

	},

	from_home_to_page2: (tl, _parent, _old, _new, callback ) => {

		tweens.add_home_out( tl, 0 )
		tweens.add_page2_in( tl, t * 45 )

	},

	from_page2_to_home: (tl, _parent, _old, _new, callback ) => {

		tweens.add_page2_out( tl, 0 )
		tweens.add_home_in( tl, t * 45 )

	},

	from_page1_to_page2: (tl, _parent, _old, _new, callback ) => {

		tweens.add_page1_out( tl, 0 )
		tweens.add_page2_in( tl, t * 45 )

	},

	from_page2_to_page1: (tl, _parent, _old, _new, callback ) => {

		tweens.add_page2_out( tl, 0 )
		tweens.add_page1_in( tl, t * 45 )

	}

}










let tweens = {

	add_home_in: ( tl, d ) => {

		tl.add( gsap.fromTo(
			nodes.home.header,
			t * 60,
			{
				x: -20,
				opacity: 0
			},
			{
				x: 0,
				opacity: 1,
				ease: eases.zip_in,
				clearProps: 'all'
			}
		), d + t * 0 )

		tl.add( gsap.fromTo(
			nodes.home.links,
			t * 60,
			{
				x: -20,
				opacity: 0
			},
			{
				x: 0,
				opacity: 1,
				ease: eases.zip_in,
				stagger: t * 5,
				clearProps: 'all'
			}
		), d + t * 20 )

	},

	add_page1_in: ( tl, d ) => {

		tl.add( gsap.fromTo(
			nodes.page1.header,
			t * 60,
			{
				x: -20,
				opacity: 0
			},
			{
				x: 0,
				opacity: 1,
				ease: eases.zip_in,
				clearProps: 'all'
			}
		), d + t * 0 )

		tl.add( gsap.fromTo(
			nodes.page1.links,
			t * 60,
			{
				x: -20,
				opacity: 0
			},
			{
				x: 0,
				opacity: 1,
				ease: eases.zip_in,
				stagger: t * 5,
				clearProps: 'all'
			}
		), d + t * 20 )

	},

	add_page2_in: ( tl, d ) => {

		tl.add( gsap.fromTo(
			nodes.page2.header,
			t * 60,
			{
				x: -20,
				opacity: 0
			},
			{
				x: 0,
				opacity: 1,
				ease: eases.zip_in,
				clearProps: 'all'
			}
		), d + t * 0 )

		tl.add( gsap.fromTo(
			nodes.page2.links,
			t * 60,
			{
				x: -20,
				opacity: 0
			},
			{
				x: 0,
				opacity: 1,
				ease: eases.zip_in,
				stagger: t * 5,
				clearProps: 'all'
			}
		), d + t * 20 )

	},


	add_home_out: ( tl, d ) => {

		tl.add( gsap.fromTo(
			nodes.home.header,
			t * 60,
			{
				x: 0,
				opacity: 1
			},
			{
				x: 20,
				opacity: 0,
				ease: eases.zip_out
			}
		), d + t * 0 )

		tl.add( gsap.fromTo(
			nodes.home.links,
			t * 60,
			{
				x: 0,
				opacity: 1
			},
			{
				x: 20,
				opacity: 0,
				ease: eases.zip_out,
				stagger: t * 5
			}
		), d + t * 20 )

	},

	add_page1_out: ( tl, d ) => {

		tl.add( gsap.fromTo(
			nodes.page1.header,
			t * 60,
			{
				x: 0,
				opacity: 1
			},
			{
				x: 20,
				opacity: 0,
				ease: eases.zip_out
			}
		), d + t * 0 )

		tl.add( gsap.fromTo(
			nodes.page1.links,
			t * 60,
			{
				x: 0,
				opacity: 1
			},
			{
				x: 20,
				opacity: 0,
				ease: eases.zip_out,
				stagger: t * 5
			}
		), d + t * 20 )

	},

	add_page2_out: ( tl, d ) => {

		tl.add( gsap.fromTo(
			nodes.page2.header,
			t * 60,
			{
				x: 0,
				opacity: 1
			},
			{
				x: 20,
				opacity: 0,
				ease: eases.zip_out
			}
		), d + t * 0 )

		tl.add( gsap.fromTo(
			nodes.page2.links,
			t * 60,
			{
				x: 0,
				opacity: 1
			},
			{
				x: 20,
				opacity: 0,
				ease: eases.zip_out,
				stagger: t * 5
			}
		), d + t * 20 )

	},


}


























export { transitions as default }