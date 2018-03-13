'use strict';

var express = require('express');
var router = express.Router();
var cors = require('cors');
var fs = require('fs');
var path = require('path');

router.use(cors());

// Hello world

router.get('/', function (req, res, next) {
    res.sendFile(path.join(__dirname, '..', '..', 'dist', 'public', 'index.html'));
});

module.exports = router;