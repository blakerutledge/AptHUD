let express = require('express')
let path = require('path')
let fs = require('fs')
let favicon = require('serve-favicon')
let logger = require('morgan')
let cookieParser = require('cookie-parser')
let bodyParser = require('body-parser')
let engine = require('express-dot-engine')
let compression = require('compression')
let cors = require('cors')
let contentful = require('contentful')

let config = require( path.join(__dirname, '..', 'config.json') )

let index = require('./routes/index')
let darksky = require( './darksky' )

let app = express()


//Gzip compression
app.use(compression())

// Allow CORS
app.use(cors())



app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())

// view engine setup
app.engine('dot', engine.__express)
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'dot')

// Routes
app.use('/', index)

// favicon
app.use(favicon(path.join(__dirname, '..', 'dist', 'public', 'favicon.ico')))


// Webhook debounced, wont fetch more than 1 every 3sec
// Successive webhooks restart the timer

let contentfulDebouncing = false
let contentfulTimeout

exports.handle_webhook = () => {
  contentfulDebouncing = true
  clearTimeout( contentfulTimeout )
  contentfulTimeout = setTimeout( () => {
    exports.fetch_content()
  }, 3000)
}

exports.fetch_content = () => {

  var client = contentful.createClient({
    space: config.contentful.space,
    accessToken: config.contentful.accessToken
  })

  // Get all site content & rehost :)
  client.getEntries()
    .then( (content) => {
      let _json = JSON.stringify(content)
      fs.writeFile('dist/public/content.json', _json, 'utf8', () => {
        console.log('fetched new content, and saved content to disk')
      })
    })

}


// Serve static
app.use(express.static(path.join(__dirname, '..', 'dist', 'public')))

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error('Not Found')
  err.status = 404
  next(err)
})

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)

  if (err.status === 404) {
    let url = req.headers.host + req.originalUrl
    if ( ! ( url.split("\\").pop().split('.').length > 1 ) ) {
      // if url has file extension, keep error code as 404
      // if not, its an internal deep link. let client determine if its valid  
      res.status( 200 )
    }

  	res.sendFile( path.join(__dirname, '..', 'dist', 'public', 'index.html') )
  }
  else {
  	res.render('error')
  }
})

module.exports = app


darksky.build()

app.use(logger('dev'))