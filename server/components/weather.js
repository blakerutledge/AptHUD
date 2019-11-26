import jsonfile from 'jsonfile'
import request from 'request'
import path from 'path'
import fs from 'fs'

import * as icons from './icons'


let interval = undefined

let days = [ 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday' ]

export let data = {}

export let build = () => {

	interval = setInterval( fetch_weather, process.env.DARKSKY_FETCH_INTERVAL * 1000 )

	fetch_weather()

}


let fetch_weather = () => {


	if ( process.env.SERVER_DEV_CONTENT_ONLY == 1 ) {

		console.log( '🦄  Fallback to local weather content, not fetching live weather data' )

		let body = require('./dev-weather.json')

		let filtered = filter( body )

		var _path = path.join( __dirname, '..', '..', 'data', 'weather.json' )

		jsonfile.writeFile( _path, filtered, 'utf8', () => {
			console.log( '💾  wrote weather data to disk' )
			data = filtered
		} )

	}
	else {

		console.log( '🌤  requesting current weather data' )

		request( 'https://api.darksky.net/forecast/' + process.env.DARKSKY_SECRET_KEY + '/40.7133,-73.9509/', ( error, response, body ) => {

			let filtered = filter( JSON.parse( body ) )

			if ( error ) {
				console.log( '🚫  error fetching and storing weather data' )
				console.log( error )
			}
			else {
				// var _path = path.join( __dirname, '..', '..', 'data', 'weather.json' )
				var path = path.join( './../../visualization/assets/dev-content/weather.json' )
				jsonfile.writeFile( _path, filtered, 'utf8', () => {
					console.log( '💾  wrote weather data to disk' )
					data = filtered
				} )

			}

		} )

	}


}






// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - FILTERS

let filter = ( body ) => {

	let obj = {
		current: filter_current( body ),
		hourly: filter_hourly( body ),
		forecast: filter_forecast( body ),
		raw: body
	}

	return obj

}

let filter_current = ( response ) => {

	let output = {}

	var c = 				response.currently

	output.icon = 			icons.convert( "wi-" + c.icon )
	output.temp = 			Math.round( c.temperature )
	output.feels_like = 	Math.round( c.apparentTemperature )
	output.wind = 			Math.round( c.windSpeed )
	output.precip = 		Math.round( 100 * c.precipProbability )
	output.humid = 			Math.round( 100 * c.humidity )
	output.descr = 			c.summary

	return output

}


let filter_hourly = ( response ) => {

	let output = []
	
	let offset = 0

	let d = new Date( response.currently.time )
	for ( let i=0; i<24; i++ ) {
		let x = response.hourly.data[ i ]
		let dd = new Date( x.time * 1000 )
		if ( dd.getHours() == d.getHours() ) {
			offset = i
		}
	}

	for ( let i=0; i<24; i++ ) {
		
		let x = response.hourly.data[ i + offset ]
		let dd = new Date( x.time * 1000 )

		output.push( {
			hour: 		dd.getHours(),
			icon: 		icons.convert( "wi-" + x.icon ),
			temp: 		Math.round( x.temperature ),
			wind: 		Math.round( x.windSpeed ),
			precip: 	Math.round( 100 * x.precipProbability ),
			humid: 		Math.round( 100 * x.humidity )
		} )
	}

	return output

}


let filter_forecast = (response ) => {

	let output = []

	response.daily.data.forEach( ( x, i ) => {

		var d = new Date( x.time * 1000 )

		output.push( {
			day: 		days[ d.getDay() ][ 0 ],
			icon: 		icons.convert( "wi-" + x.icon ),
			hi: 		Math.round( x.temperatureHigh ),
			lo: 		Math.round( x.temperatureLow ),
			precip: 	Math.round( 100 * x.precipProbability ),
		} )

	} )

	return output

}



// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  ENDPOINT

export let api = {

	default: ( req, res ) => {

		if ( true ) {
			res.status = 200
			res.json( data )
		}
		else {
			res.status = 401
			res.json({ error: 'unauthorized weather content request' })
		}

	}


}