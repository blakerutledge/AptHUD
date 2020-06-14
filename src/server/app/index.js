// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  IMPORTS

import dotenv from'dotenv'
dotenv.config( './../../.env' )

import express  		from 'express'
import logger  			from 'morgan'
import path  			from 'path'
import fs  				from 'fs'
import compression  	from 'compression'
import cors  			from 'cors'
import cookieParser  	from 'cookie-parser'
import bodyParser  		from 'body-parser'
import engine  			from 'express-dot-engine'

import * as controller  from './controller'
import routes 			from './../routes/index'
import * as content 	from './../components/content'


// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - CONFIG app

let app = express()

app.use( compression() )		// Use gzip compression
app.use( cors() )				// Allow CORS

// Parsers
app.use( bodyParser.json( { limit: '10mb' } ) )
app.use( bodyParser.urlencoded( { limit: '10mb', extended: false } ) )
app.use( cookieParser() )

// DoT Views
app.engine( 'dot', engine.__express )
app.set( 'view engine', 'dot' )
app.set( 'views', path.join( __dirname, '..', 'views' ) )

// Routes
app.use( '/', routes )

// Static files
app.use( express.static( path.join( __dirname, '..', '..', '..', 'dist', 'frontend' ) ) )
app.use( logger('dev') )		// Debug

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
controller.build()


// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  EXPORTS

// export default app
export default app