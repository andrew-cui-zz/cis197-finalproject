// api for database
const user = require('./models/user.js')
const trip = require('./models/trip.js')

// add single trip
var addTrip = function (tripID, name, length, itinerary, keywords, author, callback) {
  const t = new trip({
    tripID: tripID,
    name: name,
    length: length,
    itinerary: itinerary,
    keywords: keywords,
    author: author
  })

  t.save((err) => {
    if (!err) {
      // save data and return to the travelrouter
      callback(t, null)
    } else {
      // return the error
      callback(null, err)
    }
  })
}

// gets current # of trips to compute next ID
var getNumTrips = function (callback) {
  trip.count({}, function(err, count) {
    if (!err) {
      callback(count, null)
    } else {
      callback(null, err)
    }
  })
}

// get JSON of all trips
var getAllTrips = function (callback) {
  trip.find({}, function(err, data) {
    if (!err) {
      callback(data, null)
    } else {
      callback(null, err)
    }
  })
}

// get trip by tripID
var getTripByID = function (id, callback) {
  trip.find({'tripID': id}, function(err, data) {
    if (!err) {
      callback(data, null)
    } else {
      callback(null, err)
    }
  })
}

// get trip by userID - goal is to abstract this
var getTripByUser = function (user, callback) {
  console.log(user)
  trip.find({'author': user}, function(err, data) {
    if (!err) {
      callback(data, null)
    } else {
      callback(null, err)
    }
  })
}

// delete trip by tripID
var deleteTrip = function (tripID, callback) {
  trip.find({'tripID': tripID}).remove((err) => {
    if (!err) {
      callback('Removed trip!', null)
    } else {
      callback(null, err)
    }
  })
}

module.exports = {
  // each type of functions
  addTrip: addTrip,
  getNumTrips: getNumTrips,
  getAllTrips: getAllTrips,
  getTripByID: getTripByID,
  getTripByUser: getTripByUser,
  deleteTrip: deleteTrip
}