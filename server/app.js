let express = require('express')
let path = require('path')
let favicon = require('serve-favicon')
let logger = require('morgan')
let cookieParser = require('cookie-parser')
let bodyParser = require('body-parser')
let index = require('./routes/index')

let engine = require('express-dot-engine')
let compression = require('compression')
let cors = require('cors')

let app = express()

//Gzip compression
app.use(compression())

// Allow CORS
app.use(cors())

app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
// app.use(bodyParser.json({limit: '10mb'}));
// app.use(bodyParser.urlencoded({limit: '10mb', extended: false }));

app.use(cookieParser())

// view engine setup
app.engine('dot', engine.__express)
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'dot')

// Routes
app.use('/', index)

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))

app.use( express.static( path.join( __dirname, '..', 'dist', 'public') ) )

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
  res.render('error')
})

module.exports = app