export let nodes = {
	home: {},
	page1: {},
	page2: {}
}


export let build = ( section ) => {


	if ( section === 'home' ) {
		
		nodes.home.header = qs('.section.home h1')
		nodes.home.links = qsa('.section.home .link')

	}
	else if ( section === 'page1' ) {
		
		nodes.page1.header = qs('.section.page1 h1')
		nodes.page1.links = qsa('.section.page1 .link')

	}
	else if ( section === 'page2' ) {
		
		nodes.page2.header = qs('.section.page2 h1')
		nodes.page2.links = qsa('.section.page2 .link')

	}
	else {

		nodes.body = qs('body')
		nodes.world = qs('.world')
		nodes.container_outer = qs('.container')
		nodes.container = qs('.container-inner')

		// Disable Context Menu (appears on long press sometimes)
		/*nodes.container.oncontextmenu = (event) => {
			event.preventDefault()
			event.stopPropagation()
			return false
		}*/

		console.log( '%c nodes ', 'background: #009999; color: #fff', nodes )

	}

}



// Some syntactic sugar, my neighbor

let qs = (selector) => {
	return document.querySelector(selector)
}

let qsa = (selector) => {
	return Array.prototype.slice.call(document.querySelectorAll(selector))
}