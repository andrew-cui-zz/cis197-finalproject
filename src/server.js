const express = require('express')
const path = require('path')
const app = express()
const flash = require('connect-flash')
const bodyParser = require('body-parser')
const cookieSession = require('cookie-session')

// importing db and api
require('../db/dbconnect.js') // connect to mongodb
const acctDB = require('../db/account.js') // account routers
const tripDB = require('../db/travelplan.js') // account routers

// session and bodyparser
const port = process.env.PORT || 197
app.set('port', port)
app.set('view engine', 'html')
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '..', 'public/views')) // set views for ejs
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(
  cookieSession({
    name: 'local-session',
    keys: ['spooky'],
    maxAge: 4 * 60 * 60 * 1000, // 4 hours
  })
)
app.use(flash())

// install routers for all prefixes to certain routers
app.use(express.static('public'));
app.use('/account', require('./server/routes/accountRouter')(acctDB))
app.use('/trip', require('./server/routes/travelRouter')(tripDB))
app.use('/', require('./server/routes/viewRouter')(path))

// start server and create local port
app.listen(app.get('port'), () => console.log('listening on port ' + port + '!'))