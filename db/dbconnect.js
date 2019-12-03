const mongoose = require('mongoose')

// Connect to mongodb
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/travelblog')

const traveler = mongoose.connection
traveler.on('error', 
  console.error.bind(console, 'connection error:')
)
traveler.once('open', function() {
  console.log('travel db connected')
})

module.exports = traveler