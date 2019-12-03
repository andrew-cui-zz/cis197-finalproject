// api for database
const user = require('./models/user.js')
const trip = require('./models/trip.js')
const travelFunctions = require('./models/functions/travelFunctions.js')

// router for checkbox functions
var computeTripResults = function (body) {
  return(travelFunctions.computeCheckboxes(body))
}

// add single trip
var addTrip = function (tripID, location, img, places, keywords, creator, callback) {
  // verify img is URL
  const t = new trip({
    tripID: tripID,
    location: location,
    img: img,
    ratings: [],
    places: places,
    keywords: keywords,
    creator: creator
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

// add data to existing trip
var addPlace = function (id, placeName, placeCategory, placePrice, interested, visited, callback) {
  trip.findOne({'tripID': id}, function(err, t) {
    if (t) {
      if (!t.places) {
        // first location
        t.places = []
      }
      // add to locations
      t.places.push({
        "name": placeName,
        "category": placeCategory,
        "price": placePrice,
        "interested": interested,
        "visited": visited
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
    } else {
      // did not find the trip
      callback(null, 'Invalid trip')
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

// get four trips at random
var getDiscover = function (callback) {
  getAllTrips((data, err) => {
    if (!err) {
      // fill out to size 4
      while (data.length < 4) {
        data.push({
          name: null
        })
      }
      // need to do random
      const shuffled = [...data].sort(() => 0.5 - Math.random());
      callback(shuffled.slice(0, 4), null)
    } else {
      callback(null, err)
    }
  })
}

// get singular random tripID
var getRandomID = function (callback) {
  let ID = []
  getAllTrips((data, err) => {
    if (!err) {
      for (var i = 0; i < data.length; i++) {
        ID.push(data[i].tripID)
      }
      callback(ID[Math.floor(Math.random()*ID.length)], null)
    } else {
      callback(null, err)
    }
  })
}

// get trip by tripID
var getTripByID = function (id, callback) {
  trip.findOne({'tripID': id}, function(err, data) {
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
  trip.find({'creator': user}, function(err, data) {
    if (!err) {
      callback(data, null)
    } else {
      callback(null, err)
    }
  })
}

// update average in a trip
var updateAverage = function (tripID, newRating, callback) {
  getTripByID(tripID, (t, err) => {
    if (!err) {
      t.ratings.push(newRating) // update rating
      console.log(t.ratings)

      t.save((err) => {
        if (!err) {
          callback(t, null)
        } else {
          callback(null, err)
        }
      })
    } else {
      callback(t.ratings, err)
    }
  })
}

// update the results of a user input
var updatePlaces = function (tripID, userID, body, callback) {
  const { interested, visited } = computeTripResults(body)

  let updateInterested = new Set()
  let updateVisited = new Set()
  
  getTripByID(tripID, (t, err) => {
    if (!err) {
      // update each of the places
      // ideally we have these as sets from the start
      for (let i = 0; i < t.places.length; i++) {  
        updateInterested = new Set(t.places[i].interested)
        updateVisited = new Set(t.places[i].visited)
        
        if (interested[i]) {
          updateInterested.add(userID)
        } else {
          updateInterested.delete(userID)
        }

        if (visited[i]) {
          updateVisited.add(userID)
        } else {
          updateVisited.delete(userID)
        }

        t.places[i].interested = Array.from(updateInterested)
        t.places[i].visited = Array.from(updateVisited)
      }

      // save the trip variable
      t.save((err) => {
        if (!err) {
          callback(t, null)
        } else {
          callback(null, err)
        }
      })
    } else {
      callback(null, err)
    }
  })
}

// delete trip by tripID
var deleteTrip = function (tripID, callback) {
  trip.deleteOne({'tripID': tripID}, (err) => {
    if (!err) {
      callback('Removed location!', null)
    } else {
      callback(null, err)
    }
  })
}

module.exports = {
  // each type of functions
  addTrip: addTrip,
  addPlace: addPlace,
  getNumTrips: getNumTrips,
  getAllTrips: getAllTrips,
  getTripByID: getTripByID,
  getRandomID: getRandomID,
  getTripByUser: getTripByUser,
  getDiscover: getDiscover,
  deleteTrip: deleteTrip,
  computeTripResults: computeTripResults, 
  updatePlaces: updatePlaces,
  updateAverage: updateAverage
}