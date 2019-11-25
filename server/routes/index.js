// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  IMPORTS

let express = require('express')

let fs = require('fs')
let path = require('path')
let cors = require('cors')

let app = require('./../app')


// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  CONFIG router

let router = express.Router()
router.use( cors() )


// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - ROUTES

// Remove www & redirect
router.get( '/*', ( req, res, next ) => {
	if (req.headers.host.match(/^www/) !== null ) {
		let new_url = req.headers.host.replace(/^www\./, '') + req.url
		res.redirect('https://' + new_url )
	}
	else { next() }
})


/*


	More routes here


*/






module.exports = router