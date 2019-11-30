const router = require('express').Router()

module.exports = (path) => {
  router.get('/', (req, res) => {
    req.flash('user', req.session.user)
    res.render('index.ejs', {
      user: req.flash('user')
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

  // if none of the previous routes work, return index.html
  router.get('*', (req, res) => {
    req.flash('user', req.session.user)
    res.render('index.ejs', {
      user: req.flash('user')
    })
    // res.sendFile(path.join(__dirname, '..', '../../public/views', 'index.html'))
  })
  
  return router
}