let express = require('express')
let router = express.Router()
let cors = require('cors')
let fs = require('fs')
let path = require('path')


router.use(cors())


// Hello world

router.get('/', function(req, res, next){
    res.sendFile( path.join(__dirname, '..', '..', 'dist', 'public', 'index.html') )
})


module.exports = router