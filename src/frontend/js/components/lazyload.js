import Layzr from 'layzr.js'

import * as utils from './utils'
import { nodes } from './nodes'
import { sync_heights } from './../app/controller'
import insert_video from './insert-video'


export let instance


export let parse_embedly = () => {

	let embeds = utils.qsa('a.embedly-card')

	embeds.forEach( el => {
		insert_video( el.parentElement, el.href.replace('https://vimeo.com/','https://player.vimeo.com/video/'), 'vimeo', 1 )
	} )

}

export let update = () => {

	// parse_embedly()

	instance
		.update()
		.check()
}

export let check = () => {
	setTimeout( () => {
		instance.check()
	}, 200)
}

export let build = () => {

	instance = Layzr({
		threshold: 10,
		container: nodes.blend_mode_clip
	} )

	instance
		.update()
		.check()
		.handlers( true )
		.on( 'src:after', ( element ) => {

			let path_ = element.getAttribute( 'src' )
			let type = element.tagName.toLowerCase()

			if ( type==='div' ) {

				let temp = document.createElement( 'img' )
				temp.src = path_
				temp.width = '0px'
				temp.height = '0px'
				temp.addEventListener( 'load', x => {
					element.style.backgroundImage = `url('${path_}')`
					element.parentElement.classList.remove('loading')
					element.classList.remove('loading')
					temp.remove()
				} )
				element.appendChild(temp)

			}
			else if ( type === 'iframe' ) {
				element.addEventListener( 'load', x => {
					element.parentElement.classList.remove('loading')
					element.parentElement.classList.remove('spinning')
					element.classList.remove('loading')
				} )
			}
			else {
				element.addEventListener( 'load', x => {
					element.parentElement.classList.remove('loading')
					element.classList.remove('loading')
				} )	
			}


			requestAnimationFrame( () => {
				sync_heights()
			} )

			setTimeout( () => {
				sync_heights() // sticky on mobile
			}, 100 )

		} )

}