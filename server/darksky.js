var request = require('request')
let jsonfile = require('jsonfile')
let path = require('path')
let fs = require('fs')

let interval = undefined

exports.build = () => {

	interval = setInterval( get_weather, 300 * 1000 )

	get_weather()

}

let get_weather = () => {

	let data = {}

	request( 'https://api.darksky.net/forecast/49406dbaada81fa982211667930f8959/40.7133,-73.9509/', ( error, response, body ) => {

		if ( error ) {
			console.log( error )
		}
		else {
			var _path = path.join( __dirname, '..', 'dist', 'public', 'weather.json' )
			console.log( _path )
			fs.writeFile( _path, JSON.stringify( body ), 'utf8', () => {
				console.log('wrote weather...')
			} )

		}

	} )


}