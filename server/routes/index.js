// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  IMPORTS

import express from 'express'

import fs from 'fs'
import path from 'path'
import cors from 'cors'

import * as weather from './../components/weather'


// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  CONFIG router

let router = express.Router()

// router.use( cors() )


// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - ROUTES

router.post( '/api/weather', ( req, res ) => {
	weather.api.default( req, res )
})

router.get( '/api/weather', ( req, res ) => {
	weather.api.default( req, res )
})

/*


	More routes here


*/


export default router