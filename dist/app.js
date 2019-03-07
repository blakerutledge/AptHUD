'use strict';

var express = require('express');
var path = require('path');
var fs = require('fs');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var engine = require('express-dot-engine');
var compression = require('compression');
var cors = require('cors');
var contentful = require('contentful');

var config = require(path.join(__dirname, '..', 'config.json'));

var index = require('./routes/index');
var darksky = require('./darksky');

var app = express();

//Gzip compression
app.use(compression());

// Allow CORS
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// view engine setup
app.engine('dot', engine.__express);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'dot');

// Routes
app.use('/', index);

// favicon
app.use(favicon(path.join(__dirname, '..', 'dist', 'public', 'favicon.ico')));

// Webhook debounced, wont fetch more than 1 every 3sec
// Successive webhooks restart the timer

var contentfulDebouncing = false;
var contentfulTimeout = void 0;

exports.handle_webhook = function () {
  contentfulDebouncing = true;
  clearTimeout(contentfulTimeout);
  contentfulTimeout = setTimeout(function () {
    exports.fetch_content();
  }, 3000);
};

exports.fetch_content = function () {

  var client = contentful.createClient({
    space: config.contentful.space,
    accessToken: config.contentful.accessToken
  });

  // Get all site content & rehost :)
  client.getEntries().then(function (content) {
    var _json = JSON.stringify(content);
    fs.writeFile('dist/public/content.json', _json, 'utf8', function () {
      console.log('fetched new content, and saved content to disk');
    });
  });
};

// Serve static
app.use(express.static(path.join(__dirname, '..', 'dist', 'public')));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);

  if (err.status === 404) {
    var url = req.headers.host + req.originalUrl;
    if (!(url.split("\\").pop().split('.').length > 1)) {
      // if url has file extension, keep error code as 404
      // if not, its an internal deep link. let client determine if its valid  
      res.status(200);
    }

    res.sendFile(path.join(__dirname, '..', 'dist', 'public', 'index.html'));
  } else {
    res.render('error');
  }
});

module.exports = app;

darksky.build();

app.use(logger('dev'));