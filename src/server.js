const express = require('express')
const path = require('path')
const app = express()
var bodyParser = require('body-parser')
var cookieSession = require('cookie-session')

// importing db and api
const traveler = require('../db/dbconnect.js') // connect to mongodb
const db = require('../db/api')

// session and bodyparser
app.set('view engine', 'html')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(
  cookieSession({
    name: 'local-session',
    keys: ['spooky'],
    maxAge: 4 * 60 * 60 * 1000, // 4 hours
  })
)

// install routers for all prefixes to certain routers
app.use('/api', require('./server/routes/apirouter')(db))
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'))
})
// start server and create local port
app.listen(3000, () => console.log('listening on port 3000!'))