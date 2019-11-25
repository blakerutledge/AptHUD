// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  IMPORTS

import express from 'express'

import fs from 'fs'
import path from 'path'
import cors from 'cors'

import * as weather from './../components/weather'


// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - ROUTES

export let router

export const build = () => {


	router = express.Router()

	router.use( cors )


	router.post('/', function (req, res) {
	  res.send('hello world')
	})

	router.post( '/api/weather', ( req, res ) => {
		// weather.api.default( req, res )
		res.send('hello world')
	})


/*


	More routes here


*/



}