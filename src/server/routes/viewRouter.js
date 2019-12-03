const router = require('express').Router()
const tripDB = require('../../../db/travel.js')

module.exports = (path) => {
  router.get('/', (req, res) => {
    req.flash('user', req.session.user)
    // get discover layout for 4 random trips
    tripDB.getDiscover((data, err) => {
      if (!err) {
        req.flash('data', data)
        res.render('index.ejs', {
          user: req.flash('user'),
          data: req.flash('data'),
          message: req.flash('message'),
          validate: req.flash('validate')
        })
      } else {
        // error handling
        req.flash('data', [])
        req.flash('message', err)
        req.flash('validate', null)
        res.render('index.ejs', {
          user: req.flash('user'),
          data: req.flash('data'),
          message: req.flash('message'),
          validate: req.flash('validate')
        })
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

  router.get('/search', (req, res) => {
    if (!req.session.user || req.session.user.length === 0) {
      // need an error msg
      req.flash('message', 'Please log in first!')
      res.redirect('/')
    } else {
      req.flash('user', req.session.user)
      res.render('search.ejs', {
        user: req.flash('user'),
        message: req.flash('message'),
        query: req.flash('query'),
        data: req.flash('data')
      })
    }
  })

  router.get('/view', (req, res) => {
    // don't let a non-logged in user view
    if (!req.session.user || req.session.user.length === 0) {
      // need an error msg
      req.flash('message', 'Please log in first!')
      res.redirect('/')
    } else {
      req.flash('user', req.session.user)
      res.render('trip.ejs', {
        user: req.flash('user'),
        data: req.flash('data')
      })
    }
  })

  router.get('/create', (req, res) => {
    // don't let a non-logged in user view
    if (!req.session.user || req.session.user.length === 0) {
      // need an error msg
      req.flash('message', 'Please log in first!')
      req.flash('validate', null)
      res.redirect('/')
    } else {
      req.flash('user', req.session.user)
      res.render('create.ejs', {
        user: req.flash('user'),
        message: req.flash('message'),
        validate: req.flash('validate')
      })
    }
  })

  // if none of the previous routes work, return index.html
  router.get('*', (req, res) => {
    res.redirect('/')
  })
  
  return router
}