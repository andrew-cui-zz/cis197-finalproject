const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username: { type: String },
  password: { type: String }
})

// country: { type: String },,
  // creationTime: { type: Timestamp } 

module.exports = mongoose.model('user', userSchema)