import _hash from 'js-sha256'

export const sane_typeof = ( data ) => {

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

export const array__of_objs_sort = ( arr, fn ) => {
	/* ex fn:
	( a, b ) => {
		return a.num - b.num
	}*/
	return arr.sort( fn )
}

export const file_extension = ( filepath ) => {
	if ( typeof filepath !== 'string' ) return false
	let re = /(?:\.([^.]+))?$/;
	return re.exec( filepath )[1]
}

export const dist = ( x1, y1, x2, y2 ) => {
	return Math.pow( Math.pow( x2 - x1, 2 ) + Math.pow( y2 - y1, 2 ), 0.5 )
}

export const dist_from_origin = ( x, y ) => {
	return Math.pow( Math.pow( x, 2 ) + Math.pow( y, 2 ), 0.5 )
}

export const normalize = ( value, min, max, if_clamp ) => {
	let norm = ( value - min ) / ( max - min )
	if ( if_clamp ) norm = clamp( norm, 0, 1 )
	return norm
}

export const clamp = (value, min, max) => {
	let val = value > max ? max : value
	val = val < min ? min : val
	return val
}

export const clamp_loop = (value, min, max) => {
	let range = max - min
	let val = value > max ? value % range : value
	val = val < min ? max - ( min - val ) % range : val
	return val
}

export const timestamp = () => {
	let d = new Date()
	let str = `${d.getYear()}-${d.getMonth()}-${d.getDate()}-${d.getHours()}-${d.getMinutes()}`
	return str
}

export const uuid = (a,b) => { for(b=a='';a++<36;b+=a*51&52?(a^15?8^Math.random()*(a^20?16:4):4).toString(16):'-'); return b }

export const hash = ( string ) => {
	return ( exports.typeof( string ) !== 'string' ) 
		? false
		: _hash( string )
}