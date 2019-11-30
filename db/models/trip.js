const mongoose = require('mongoose')

// each trip has a name, length, keywords, and author
// each itinerary has a list of days (ordered)
// each day has the day summary name, and visits = [time: location]
const tripSchema = new mongoose.Schema({
  tripID: { type: Number },
  name: { type: String },
  img: { type: String },
  length: { type: Number }, 
  itinerary: { 
    type: [{
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