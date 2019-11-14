const S = require('sequelize')

// Exports is schema
module.exports = {
  firstname : {
    type: S.STRING
  },
  lastname : {
    type: S.STRING
  },
  username : {
    type: S.STRING
  },
  password : {
    type: S.STRING
  }
}