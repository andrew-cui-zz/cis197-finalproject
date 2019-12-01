const mongoose = require('mongoose')

const PlaceSchema = new mongoose.Schema({
  name: String,
  category: String,
  price: String,
  interested: [String],
  visited: [String]
})

// each trip has a name, country, keywords, and author
// each itinerary has a list of locations
// interested = user IDs 
const tripSchema = new mongoose.Schema({
  tripID: { type: Number },
  location: { type: String },
  img: { type: String },
  ratings: { type: [Number] }, 
  places: [PlaceSchema],
  keywords: { type: [String] },
})

module.exports = mongoose.model('trip', tripSchema)