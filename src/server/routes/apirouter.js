const router = require('express').Router()
const api = require('../../../db/api.js')

// db parameter allows router to have access to database
module.exports = (db) => {
  router.post('/signup', (req, res) => {
    const { username, password } = req.body
    api.addUser(username, password, (data, err) => {
      // if no error, render the user added
      if (!err) {
        res.json(data)
      } else {
        // find some way to render the data
        res.send('SIGNUP ERROR: ' + err)
      }
    })
  })

  router.get('/users', (req, res) => {
    api.getAllUsers((data, err) => {
      // if no error, the data of all users
      if (!err) {
        res.json(data)
      } else {
        // find some way to render the data
        res.send('LOGIN ERROR: ' + err)
      }
    })
  })

  return router
}