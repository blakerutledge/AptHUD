var request = require('request')
let jsonfile = require('jsonfile')
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

			fs.writeFile( 'public/weather.json', JSON.stringify( body ), 'utf8', () => {
				// console.log('wrote weather...')
			} )

		}

	} )


}