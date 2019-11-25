let fs = require('fs')
let path = require('path')

let state = require('./state').data
let state_tasks = require('./state').tasks

let sockets = require('./../components/sockets')
let utils = require('./../components/utils')

let weather = require('./../components/weather')





// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - EXPORTS

// INIT on app startup
exports.build = ( http_server ) => {

	console.log('✨  Building state')

	sockets.listen( http_server )

	weather.build()




	/*
	
		to-do: add more build tasks here

	*/

}

// HANDLER to report version number
exports.get_version = () => {
	return process.env.VERSION
}



// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - STATE HELPER TASKS