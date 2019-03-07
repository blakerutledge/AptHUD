'use strict';

var express = require('express');
var contentful = require('contentful-management');
var router = express.Router();
var cors = require('cors');
var fs = require('fs');
var path = require('path');

var app = require('../app');

// - - - Dev - - - //

// Route source maps
router.get('/*', function (req, res, next) {

  var filename = req.url.split('/').pop();
  var extension = filename.split('.').pop();
  var vendor = req.url.includes('vendor');

  if ((extension === 'css' || extension === 'js') && !vendor) {
    res.setHeader('X-SourceMap', 'maps/' + filename + '.map');
  }

  return next();
});

// - - - Routes - - - //

// Serve public
router.get('/', function (req, res, next) {
  res.status(200);
  res.sendFile(path.join(__dirname, '..', '..', 'dist', 'public', 'index.html'));
});

// - - - Contenftul webhook - - - //

router.post('/contentful-webhook', function (request, response) {

  console.log('POST contentful webhook');
  app.handle_webhook();
});

// etc


module.exports = router;