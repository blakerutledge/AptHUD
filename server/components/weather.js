import jsonfile from 'jsonfile'
import request from 'request'
import path from 'path'
import fs from 'fs'

let interval = undefined


export let build = () => {

	interval = setInterval( fetch_weather, process.env.DARKSKY_FETCH_INTERVAL * 1000 )

	fetch_weather()

}


let fetch_weather = () => {


	if ( process.env.LOCAL_CONTENT_ONLY == 1 ) {

		console.log( '🦄  Fallback to local dev content, not fetching live weather data' )

	}
	else {


		let data = {}

		console.log( '🌤  requesting current weather data' )

		request( 'https://api.darksky.net/forecast/' + process.env.DARKSKY_SECRET_KEY + '/40.7133,-73.9509/', ( error, response, body ) => {

			if ( error ) {
				console.log( '🚫  error fetching and storing weather data' )
				console.log( error )
			}
			else {
				var _path = path.join( __dirname, '..', '..', 'data', 'weather.json' )
				fs.writeFile( _path, body, 'utf8', () => {
					console.log( '💾  wrote weather data to disk' )
				} )

			}

		} )

	}


}