const router = require('express').Router()
const tripDB = require('./../../../db/travelplan.js')

module.exports = (path) => {
  router.get('/', (req, res) => {
    req.flash('user', req.session.user)
    // get discover layout for 4 random trips
    tripDB.getDiscover((data, err) => {
      if (!err) {
        req.flash('data', data)
        res.render('index.ejs', {
          user: req.flash('user'),
          data: req.flash('data')
        })
      } else {
        // error handling
      }
    })
    // res.sendFile(path.join(__dirname, '..', '../../public/views', 'index.html'))
  })

  router.get('/login', (req, res) => {
    res.render('login.ejs', {
      message: req.flash('message')
    })
  })

  router.get('/signup', (req, res) => {
    res.render('signup.ejs', {
      message: req.flash('message')
    })
  })

  router.get('/account', (req, res) => {
    res.send('hi')
  })

  // if none of the previous routes work, return index.html
  router.get('*', (req, res) => {
    req.flash('user', req.session.user)
    tripDB.getDiscover((data, err) => {
      if (!err) {
        req.flash('data', data)
        res.render('index.ejs', {
          user: req.flash('user'),
          data: req.flash('data')
        })
      } else {
        // error handling
      }
    })
    // res.sendFile(path.join(__dirname, '..', '../../public/views', 'index.html'))
  })
  
  return router
}