// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  IMPORTS

import express from 'express'
import logger from 'morgan'
import path from 'path'
import fs from 'fs'
import compression from 'compression'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import engine from 'express-dot-engine'
import async	from 'async'
import jsonfile from 'jsonfile'

import favicon from 'serve-favicon'

import * as routes from './../routes/index'

import * as controller from './controller'



// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - CONFIG app

let app = express()

app.use( compression() )		// Use gzip compression
app.use( cors() )				// Allow CORS
app.use( logger('dev') )		// Debug

// Parsers
app.use( bodyParser.json( { limit: '10mb' } ) )
app.use( bodyParser.urlencoded( { limit: '10mb', extended: false } ) )
app.use( cookieParser() )

// Routes
routes.build()
app.use( '/', routes.router )

// DoT Views
// app.engine( 'dot', engine.__express )
// app.set( 'view engine', 'dot' )
// app.set( 'views', path.join( __dirname, '..', 'views' ) )

// Favicon
// let favicon_path = path.join( __dirname, '..', '..', 'dist', 'public', 'favicon.ico' )
// if ( fs.existsSync( favicon_path ) ) {
// 	app.use( favicon( favicon_path ) )
// }

// Static files
// app.use( express.static( path.join( __dirname, '..', '..', 'dist', 'public' ) ) )

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

export default app