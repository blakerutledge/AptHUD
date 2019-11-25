// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  IMPORTS

import express from 'express'

import fs from 'fs'
import path from 'path'
import cors from 'cors'



// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  CONFIG router

let router = express.Router()
router.use( cors )


// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - ROUTES

// Remove www & redirect
router.get( '/*', ( req, res, next ) => {
	if (req.headers.host.match(/^www/) !== null ) {
		let new_url = req.headers.host.replace(/^www\./, '') + req.url
		res.redirect('https://' + new_url )
	}
	else { next() }
})




router.post('/user/shows', ( req, res ) => {
	// shows.api.shows( req, res )
})

/*


	More routes here


*/





export default router