const mongoose = require('mongoose')

// each trip has a name, length, keywords, and author
// each itinerary has a list of days
// each day has the day #, day summary name, and visits = [time: location]
const tripSchema = new mongoose.Schema({
  name: { type: String },
  length: { type: Number }, 
  itinerary: { 
    type: [{
      day: { type: Number },
      summary: { type: String },
      visits: { type: [{
        time: { type: Number },
        site: { type: String }
      }]} 
    }]
  },
  keywords: { type: [String] },
  author: { type: String }
})

module.exports = mongoose.model('trip', tripSchema)