// api for database
const user = require('./models/user.js')
const accountFunctions = require('./models/functions/accountFunctions.js')

// const functions = require('./functions/functionname')
var addUser = function (username, password, callback) {
  const u = new user({
    username: username,
    password: password
  })
  user.find({username: username}, (err, result) => {
    if (result.length > 0) {
      // data exists so this user is here
      callback(null, 'User ' + u.username + ' already exists')
    } else {
      // add new user
      u.save((err) => {
        if (!err) {
          // save data and return to the apirouter
          callback(u, null)
        } else {
          // return the error
          callback(null, err)
        }
      })
    }
  })
}

var loginUser = function (username, password, callback) {
  const u = new user({
    username: username,
    password: password
  })
  user.find({username: username}, (err, result) => {
    if (!err) {
      // no error - user exists - invariant that usernames are distinct
      console.log(result)
      if (result.length == 0) {
        // user not found
        callback(null, 'Invalid username')
      } else if (result[0].password == password) {
        // correct password
        callback(username, null)
      } else {
        callback(null, 'Incorrect password')
      }
    } else {
      callback(null, err)
    }
  })
}

var getAllUsers = function (callback) {
  user.find({}, (err, users) => {
    if (!err) {
      // save data and return to the apirouter
      callback(users, null)
    } else {
      // return the error
      callback(null, err)
    }
  })
}

module.exports = {
  // each type of functions
  addUser: addUser,
  loginUser: loginUser,
  getAllUsers: getAllUsers,
  checkValidLogin: accountFunctions.checkValidLogin
}