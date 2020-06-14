export default ( el, vid, platform, autoplay ) => {

	let w = 'auto'
	let h = 'auto'
	let ifr = document.createElement('iframe')

	// AUTOPLAY defaults to true
	autoplay = ( autoplay === undefined ) ? true : autoplay
	autoplay = ( autoplay ) ? 1 : 0

	if ( platform === 'vimeo' ) {
		ifr.dataset.normal = `${vid}?autoplay=${autoplay}"`
	}
	if ( platform === 'youtube' ) {
		ifr.dataset.normal = `${data.lightbox}?autoplay=${autoplay}&iv_load_policy=3`
	}

	ifr.setAttribute('frameborder', '0')
	ifr.setAttribute('width', 'auto')
	ifr.setAttribute('height', 'auto')
	ifr.setAttribute('webkitallowfullscreen', 'true')
	ifr.setAttribute('mozallowfullscreen', 'true')
	ifr.setAttribute('allowfullscreen', 'true')
 	
	el.innerHTML = ""
	el.classList.add('video-container')
	el.classList.add('loading')

	el.appendChild( ifr )

}