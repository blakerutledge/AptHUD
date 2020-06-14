import * as nodes from './components/nodes'
import * as navigation from './components/navigation'
import * as lazyload from './components/lazyload'
import * as ajax from './components/ajax'
import * as content from './components/content'
import * as controller from './app/controller'
import templates from './components/templates'

const main = () => {

	if ( !content.all.loaded ) {

		// Build nav
		nodes.build()
		controller.build()
		navigation.build()
		lazyload.build()

		// Content has not been loaded yet. Go get it!
		ajax.get( '/assets/content.json', ( body ) => {
			content.store( body, () => {
				navigation.locate()
			} )
		} )

	}


}

document.addEventListener('DOMContentLoaded', main)