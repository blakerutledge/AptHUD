let utils = require('./utils')

exports.rgb_to_xy = (rgb) => {

	let red 	= rgb.r
	let green	= rgb.g
	let blue 	= rgb.b

	//Gamma correctie
	red = (red > 0.04045) ? Math.pow((red + 0.055) / (1.0 + 0.055), 2.4) : (red / 12.92)
	green = (green > 0.04045) ? Math.pow((green + 0.055) / (1.0 + 0.055), 2.4) : (green / 12.92)
	blue = (blue > 0.04045) ? Math.pow((blue + 0.055) / (1.0 + 0.055), 2.4) : (blue / 12.92)

	//Apply wide gamut conversion D65
	let X = red * 0.664511 + green * 0.154324 + blue * 0.162028
	let Y = red * 0.283881 + green * 0.668433 + blue * 0.047685
	let Z = red * 0.000088 + green * 0.072310 + blue * 0.986039

	let fx = X / (X + Y + Z)
	let fy = Y / (X + Y + Z)
	if (isNaN(fx)) { fx = 0.0 }
	if (isNaN(fy)) { fy = 0.0 }

    let arr = [fx.toPrecision(4),fy.toPrecision(4)]
	return arr

}

exports.xyb_to_rgb = (x, y, bri) => {

	let z = 1.0 - x - y
	let Y = bri / 255.0
	let X = (Y / y) * x
	let Z = (Y / y) * z

	let r = X * 1.612 - Y * 0.203 - Z * 0.302
	let g = -X * 0.509 + Y * 1.412 + Z * 0.066
	let b = X * 0.026 - Y * 0.072 + Z * 0.962

	r = r <= 0.0031308 ? 12.92 * r : (1.0 + 0.055) * Math.pow(r, (1.0 / 2.4)) - 0.055
	g = g <= 0.0031308 ? 12.92 * g : (1.0 + 0.055) * Math.pow(g, (1.0 / 2.4)) - 0.055
	b = b <= 0.0031308 ? 12.92 * b : (1.0 + 0.055) * Math.pow(b, (1.0 / 2.4)) - 0.055
	let maxValue = Math.max(r,g,b)
	
	r /= maxValue
	g /= maxValue
	b /= maxValue
	
	r = r * 255
	g = g * 255
	b = b * 255
		
	if (r < 0) { r = 255 }
	if (g < 0) { g = 255 }
	if (b < 0) { b = 255 }

	return {
		r: Math.round(r),
		g: Math.round(g),
		b: Math.round(b)
	}

}

exports.xyb_to_hex = (x, y, bri) => {

    let z = 1.0 - x - y
    let Y = bri / 255.0
    let X = (Y / y) * x
    let Z = (Y / y) * z

    let r = X * 1.612 - Y * 0.203 - Z * 0.302
    let g = -X * 0.509 + Y * 1.412 + Z * 0.066
    let b = X * 0.026 - Y * 0.072 + Z * 0.962

    r = r <= 0.0031308 ? 12.92 * r : (1.0 + 0.055) * Math.pow(r, (1.0 / 2.4)) - 0.055
    g = g <= 0.0031308 ? 12.92 * g : (1.0 + 0.055) * Math.pow(g, (1.0 / 2.4)) - 0.055
    b = b <= 0.0031308 ? 12.92 * b : (1.0 + 0.055) * Math.pow(b, (1.0 / 2.4)) - 0.055
    let maxValue = Math.max(r,g,b)
    
    r /= maxValue
    g /= maxValue
    b /= maxValue
    
    r = r * 255
    g = g * 255
    b = b * 255
        
    if (r < 0) { r = 255 }
    if (g < 0) { g = 255 }
    if (b < 0) { b = 255 }

    let hex = exports.rgb_to_hex( {
        r: Math.round(r),
        g: Math.round(g),
        b: Math.round(b)
    } )

    return hex

}


exports.rgb_to_hex = (rgb) => {

	function helper(x) {
		let y = x.toString(16)
		return y.length===1 ? "0"+y : y
	}
	let hex = '#' + helper(rgb.r) + helper(rgb.g) + helper(rgb.b)
	return hex

}

exports.hex_to_rgb = ( hex ) => {

    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec( hex )
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null

}


exports.hsl_to_hex = (_h,_s,_l) => {

	let h = _h / 359
	let s = _s / 100
	let l = _l / 100

	var r, g, b

    if(s == 0){
        r = g = b = l // achromatic
    }
    else{
        var hue2rgb = function hue2rgb(p, q, t){
            if(t < 0) t += 1;
            if(t > 1) t -= 1;
            if(t < 1/6) return p + (q - p) * 6 * t;
            if(t < 1/2) return q;
            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        }

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    let rgb = {
    	r: Math.round(r * 255), 
    	g: Math.round(g * 255), 
    	b: Math.round(b * 255)
    }

    return rgb_to_hex(rgb)
}


exports.rgb_to_hsb = (r, g, b) => {
	
    r /= 255, g /= 255, b /= 255
    var max = Math.max(r, g, b), min = Math.min(r, g, b)
    var h, s, b = (max + min) / 2

    if(max == min){
        h = s = 0 // achromatic
    }else{
        var d = max - min
        s = b > 0.5 ? d / (2 - max - min) : d / (max + min)
        switch(max){
            case r: h = (g - b) / d + (g < b ? 6 : 0); break
            case g: h = (b - r) / d + 2; break
            case b: h = (r - g) / d + 4; break
        }
        h /= 6
    }

    return [h, s, b ]
}


exports.hsv_to_hex = (hsv) => {

	let h = hsv.h
	let s = hsv.s
	let v = hsv.v

    let r, g, b, i, f, p, q, t
    if (arguments.length === 1) {
        s = h.s, v = h.v, h = h.h
    }
    i = Math.floor(h * 6)
    f = h * 6 - i
    p = v * (1 - s)
    q = v * (1 - f * s)
    t = v * (1 - (1 - f) * s)
    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }

    let rgb = {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
    }

    return rgb_to_hex( rgb )
}


exports.interp_rgb = ( rgb1, rgb2, factor ) => {

    rgb1 = [ rgb1.r, rgb1.g, rgb1.b ]
    rgb2 = [ rgb2.r, rgb2.g, rgb2.b ]

    if ( arguments.length < 3 ) { factor = 0.5 }
    let sliced = rgb1.slice()
    let result = {}
    let channels = ['r','g','b']
    channels.forEach( ( x, i ) => {
        result[ x ] = Math.round( sliced[ i ] + factor * ( rgb2[ i ] - rgb1[ i ] ) )
    } )

    return result
}


exports.interp_hex = ( hex1, hex2, factor ) => {

    let rgb1 = hex_to_rgb( hex1 )
    let rgb2 = hex_to_rgb( hex2 )

    let rgb3 = interp_rgb( rgb1, rgb2, factor )

    return hex_to_rgb( rgb3 )

}


exports.ctbri_to_rgb = ( ct, bri ) => {

    let ct_list = [
        { r: 255, g: 217, b: 103 },
        { r: 255, g: 225, b: 134 },
        { r: 255, g: 236, b: 179 },
        { r: 255, g: 247, b: 224 },
        { r: 255, g: 255, b: 255 },
        { r: 245, g: 255, b: 255 },
        { r: 229, g: 255, b: 255 },
        { r: 213, g: 253, b: 255 },
        { r: 203, g: 251, b: 255 }
    ]

    let bounds = {
        hi: 499,
        lo: 153
    }

    let norm = ( ct_list.length - 1 ) * utils.normalize( ct, bounds.lo, bounds.hi, true )
    let index = Math.floor( norm )
    index = ( index === ( ct_list.length - 1 ) ) ? index - 1 : index
    let weight = norm % 1

    let rgb = exports.interp_rgb( ct_list[ index ], ct_list[ index + 1 ], weight )

    for ( let channel in rgb ) {
        rgb[ channel ] = Math.round( rgb[ channel ] * bri / 255 )
    }

    return rgb

}