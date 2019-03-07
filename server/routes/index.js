const express = require('express')
const contentful = require('contentful-management')
let router = express.Router()
const cors = require('cors')
const fs = require('fs')
const path = require('path')

let app = require('../app')

// - - - Dev - - - //

// Route source maps
router.get('/*', (req, res, next) => {

  let filename = req.url.split('/').pop()
  let extension = filename.split('.').pop()
  let vendor = req.url.includes('vendor')

  if ( ( extension === 'css' || extension === 'js' ) && !vendor )  {
    res.setHeader('X-SourceMap', 'maps/' + filename + '.map')
  }

  return next()
})


// - - - Routes - - - //

// Serve public
router.get('/', (req, res, next) => {
  res.status(200)
  res.sendFile( path.join(__dirname, '..', '..', 'dist', 'public', 'index.html') )
})


// - - - Contenftul webhook - - - //

router.post('/contentful-webhook', (request, response) => {

	console.log('POST contentful webhook')
	app.handle_webhook()
	
})








// etc



module.exports = router