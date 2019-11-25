let array_equality = ( arr1, arr2 ) => {

	if ( !arr1 || !arr2 ) return false
	if ( arr1.length !== arr2.length ) return false

	for ( var i = 0; i < arr1.length; i++ ) {
		if ( arr1[ i ] instanceof Array && arr2[ i ] instanceof Array) {
			if ( !array_equality( arr1[ i ], arr2[ i ] ) )
				return false
		}
        else if ( arr1[i] !== arr2[i] ) { 
			// Warning - two different object instances will never be equal: {x:20} != {x:20}
			return false
		}           
    }

    return true
}



exports.dist = ( x1, y1, x2, y2 ) => {
	return Math.pow( Math.pow( x2 - x1, 2 ) + Math.pow( y2 - y1, 2 ), 0.5 )
}

exports.dist_from_origin = ( x, y ) => {
	return Math.pow( Math.pow( x, 2 ) + Math.pow( y, 2 ), 0.5 )
}

exports.normalize = ( value, min, max, if_clamp ) => {
	let norm = ( value - min ) / ( max - min )
	if ( if_clamp ) norm = exports.clamp( norm, 0, 1 )
	return norm
}

exports.clamp = (value, min, max) => {
	let val = value > max ? max : value
	val = val < min ? min : val
	return val
}


exports.arr_eq = ( arr1, arr2 ) => {
	let val = array_equality( arr1, arr2 )
	return val
}