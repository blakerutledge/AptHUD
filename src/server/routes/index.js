// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  IMPORTS

import express from 'express'

import fs from 'fs'
import path from 'path'
import cors from 'cors'

import * as app from './../app/index.js'
import * as controller from './../app/controller'
import * as content from './../components/content'

import * as weather from './../components/weather'


// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  CONFIG router

let router = express.Router()
router.use( cors() )
let home_page = path.join( __dirname, '..', '..', '..', 'dist', 'frontend', 'index.html' )
let content_path = path.join( __dirname, '..', '..', '..', 'data', 'content.json' )



// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - ROUTES

router.all("*", ( req, res, next ) => {

	res.header("Access-Control-Allow-Headers", ["Content-Type","X-Requested-With","X-HTTP-Method-Override","Accept"]);
	res.header("Access-Control-Allow-Credentials", true);
	res.header("Access-Control-Allow-Methods", "GET,POST");
	res.header("Cache-Control", "no-store,no-cache,must-revalidate");
	res.header("Vary", "Origin");

	 next();
	 
})


// Remove www & redirect
router.get( '/*', ( req, res, next ) => {
	if (req.headers.host.match(/^www/) !== null ) {
		let new_url = req.headers.host.replace(/^www\./, '') + req.url
		res.redirect('https://' + new_url )
	}
	else { next() }
})

router.get( '/assets/content.json', ( req, res ) => {
	res.sendFile( content_path )
})

router.post( '/assets/content.json', ( req, res ) => {
	res.sendFile( content_path )
})


router.post( '/api/weather', ( req, res ) => {
	weather.api.default( req, res )
})

router.get( '/api/weather', ( req, res ) => {
	weather.api.default( req, res )
})



// Serve static homepage
router.get('/*', function(req, res, next){
	let re = /(?:\.([^.]+))?$/;
	let has_ext = re.exec( req.url )[1] !== undefined
	if ( !has_ext ) {
		res.sendFile( home_page )
	}
	else { next() }
})


export default router