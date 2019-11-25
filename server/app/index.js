// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  IMPORTS

const express = 		require('express')
const logger = 			require('morgan')
const path = 			require('path')
const fs = 				require('fs')
const compression = 	require('compression')
const cors = 			require('cors')
const cookieParser = 	require('cookie-parser')
const bodyParser = 		require('body-parser')
const engine = 			require('express-dot-engine')
const async	= 			require('async')
const jsonfile = 		require('jsonfile')

const favicon = 		require('serve-favicon')

let routes = 			require('./../routes/index')

let controller = 		require('./controller')



// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - CONFIG app

let app = express()

app.use( compression() )		// Use gzip compression
app.use( cors() )				// Allow CORS
app.use( logger('dev') )		// Debug

// Parsers
app.use( bodyParser.json( { limit: '10mb' } ) )
app.use( bodyParser.urlencoded( { limit: '10mb', extended: false } ) )
app.use( cookieParser() )

// DoT Views
app.engine( 'dot', engine.__express )
app.set( 'view engine', 'dot' )
app.set( 'views', path.join( __dirname, '..', 'views' ) )

// Favicon
let favicon_path = path.join( __dirname, '..', '..', 'dist', 'public', 'favicon.ico' )
if ( fs.existsSync( favicon_path ) ) {
	app.use( favicon( favicon_path ) )
}

// Routes
app.use( '/', routes )

// Static files
app.use( express.static( path.join( __dirname, '..', '..', 'dist', 'public' ) ) )

// Catch 404 error
app.use( ( req, res, next ) => {
	let err = new Error( 'Not Found' )
	err.status = 404
	next( err )
})

// error handler
app.use( ( err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status( err.status || 500 )
  res.render( 'error')
})




// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  BUILD APP

let init_project_folders = () => {

	let folders = [ 'data' ]

	folders.forEach( f => {
		if ( !fs.existsSync( f ) ) { fs.mkdirSync( f ) }
	} )

}
	
init_project_folders()	



// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  EXPORTS

module.exports = app