import _hash from 'js-sha256'

export let walking_class_test = ( el, classname ) => {

	/*
		Takes a base element (probably which triggered a click) and
		walks up the DOM tree, testing if an parent element has a given
		class. Returns the matching element, or false if not found.
	*/

	let done = false
	while ( !done ) {
		let match = el && el.classList && el.classList.contains( classname )
		if 		( match )				{ return el }
		else if ( el && el.classList ) 	{ el = el.parentElement }
		else 							{ done = true; return false }
	}
}

export let sign = () => {
	return Math.random() < 0.5 ? '-' : '+'
}

export let sign_num = () => {
	return Math.random() < 0.5 ? -1 : 1
}

export let prevent_widows = ( el, _threshold ) => {

	if ( el === undefined ) {
		console.error( 'cannot prevent widows on undefined DOM element' )
		return
	}

	let threshold = ( _threshold !== undefined )
		? _threshold
		: 3
	let text = el.innerHTML.replaceAll( '&nbsp;', ' ' )
	let arr = text.split(' ')
	text = ''
	arr.forEach( ( word, i ) => {
		let space = ( i > ( arr.length - 1 - threshold ) && i < arr.length - 1 )
			? '&nbsp;'
			: ' '
		text += word + space
	})

	el.innerHTML = text

}

export let file_extension = ( filepath ) => {
	if ( typeof filepath !== 'string' ) return false
	let re = /(?:\.([^.]+))?$/;
	return re.exec( filepath )[1]
}

export let file_path = ( filepath, trim_leading_slash ) => {
	if ( typeof filepath !== 'string' ) return false
	let r = /[^\/]*$/
	let _path = filepath.replace( r, '' )
	if ( trim_leading_slash && _path[ 0 ] === '/' ) {
		_path = _path.substr( 1, _path.length )
	}
	return _path
}

export let file_name = ( filepath ) => {
	if ( typeof filepath !== 'string' ) return false
	let _name = filepath.substring(
		filepath.lastIndexOf("/")+1,
		filepath.length
	)
	return _name
}

export let document_offset = ( el ) => {
    let rect = el.getBoundingClientRect()
    let scrollLeft = window.pageXOffset || document.documentElement.scrollLeft
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop
    return { y: rect.top + scrollTop, x: rect.left + scrollLeft }
}

export let typeof_deluxe = ( data ) => {

	let type = typeof data

	// Be more specific between objects and arrays, please javascript
	if ( type === 'object' ) {
		type = ( data instanceof Object && data instanceof Array )
			? 'array'
			: 'object'
	}

	// Dont return object as type of null, please javascript
	if ( data == undefined && data !== null ) {
		type = 'undefined'
	}

	return type
}

export let dist = ( x1, y1, x2, y2 ) => {
	return Math.pow( Math.pow( x2 - x1, 2 ) + Math.pow( y2 - y1, 2 ), 0.5 )
}

export let dist_from_origin = ( x, y ) => {
	return Math.pow( Math.pow( x, 2 ) + Math.pow( y, 2 ), 0.5 )
}

export let normalize = ( value, min, max, if_clamp ) => {
	let norm = ( value - min ) / ( max - min )
	if ( if_clamp ) norm = clamp( norm, 0, 1 )
	return norm
}

export let clamp = (value, min, max) => {
	let val = value > max ? max : value
	val = val < min ? min : val
	return val
}

export let clamp_loop = (value, min, max) => {
	let range = max - min
	let val = value > max ? value % range : value
	val = val < min ? max - ( min - val ) % range : val
	return val
}

export let mix = ( norm, min, max, clamp ) => {
	let range = max - min
	let val = norm * range + min
	val = ( clamp ) ? clamp( val, min, max ) : val
	return val
}

export let qs = (selector) => {
	return document.querySelector(selector)
}

export let qsa = (selector) => {
	return Array.prototype.slice.call(document.querySelectorAll(selector))
}

export let uuid = (a,b) => {for(b=a='';a++<36;b+=a*51&52?(a^15?8^Math.random()*(a^20?16:4):4).toString(16):'-');return b}

export let hash = ( string ) => {
	return ( typeof string !== 'string' )
		? false
		: _hash( string )
}

export let rgb_to_hex = (rgb) => {

	function helper(x) {
		let y = x.toString(16)
		return y.length===1 ? "0"+y : y
	}
	let hex = '#' + helper(rgb.r) + helper(rgb.g) + helper(rgb.b)
	return hex

}

export let hex_to_rgb = ( hex ) => {

    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec( hex )
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null

}

export let hex_to_rgba_array = ( hex, alpha ) => {

    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec( hex )
    return result ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16),
        alpha !== undefined ? alpha : 1.0
    ] : null

}

String.prototype.replaceAll = function( search, replacement ) {
	let target = this
	return target.split( search ).join( replacement )
}