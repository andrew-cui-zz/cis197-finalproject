const router = require('express').Router()
const Fuse = require('fuse.js')

// db parameter allows router to have access to database from api.js
module.exports = (db) => {
  // search
  router.post('/search', (req, res) => {
    const query = req.body.searchQuery

    const options = {
      shouldSort: true,
      threshold: 0.25,
      location: 0,
      distance: 100,
      maxPatternLength: 32,
      minMatchCharLength: 1,
      keys: [
        "location",
        "keywords",
        "places.category",
        "places.name",
        "places.interested",
        "places.visited"
      ]
    }
 
    db.getAllTrips((data, err) => {
      if (!err) {
        const fuse = new Fuse(data, options) // "list" is the item array
        const result = fuse.search(query)
        req.flash('query', query)
        req.flash('message', null)

        if (result.length === 0) {
          req.flash('data', null)
        } else {
          req.flash('data', result)
        }
        res.redirect('/search')
      } else {
        req.flash('message', 'Search error: ' + err) 
        req.flash('query', query)
        req.flash('data', null)
        res.redirect('/search')
      }
    })
  })

  // get number of trips - used in creation
  router.get('/count', (req, res) => {
    db.getNumTrips((data, err) => {
      if (!err) {
        res.send('Current # of trips: ' + data)
      } else {
        req.flash('message', 'Error: ' + err) 
        req.flash('validate', null)
        res.redirect('/')
      }
    })
  })

  // get four random trips
  router.get('/discover', (req, res) => {
    db.getDiscover((data, err) => {
      if (!err) {
        req.flash('data', data)
        res.redirect('/')
      } else {
        req.flash('message', 'Error: ' + err) 
        req.flash('validate', null)
        res.redirect('/')
      }
    })
  })

  // get singular random trips
  router.get('/random', (req, res) => {
    db.getRandomID((tripID, err) => {
      if (!err) {
        db.getTripByID(tripID, (data, err) => {
          if (!err) { 
            res.redirect('/trip/get/' + tripID)
          } else {
            req.flash('message', 'Error: Insufficient data') 
            req.flash('validate', null)
            res.redirect('/')
          }
        })
      } else {
        req.flash('message', 'Error: Insufficient data') 
        req.flash('validate', null)
        res.redirect('/')
      }
    })
  })
  
  // get trip by id
  // need better route otherwise it catches everything
  router.get('/get/:tripID', (req, res) => {
    const tripID = req.params.tripID
    // const tripID = req.body.id
    db.getTripByID(tripID, (data, err) => {
      if (!err) { 
        if (!req.session.user || req.session.user.length === 0) {
          // need an error msg
          req.flash('message', 'Please log in first!')
          req.flash('validate', null)
          res.redirect('/')
        } else {
          req.flash('data', data)
          req.flash('user', req.session.user)

          // don't redirect since we want users to be able to refresh
          res.render('trip.ejs', {
            user: req.flash('user'),
            data: req.flash('data'),
            message: req.flash('message'),
            validate: req.flash('validate')
          })
        }
      } else {
        req.flash('message', 'Error: Insufficient data') 
        req.flash('validate', null)
        res.redirect('/')
      }
    })
  })

  // update current average
  router.post('/average/:tripID/', (req, res) => {
    const tripID = req.params.tripID
    const newRating = Number(req.body.rating)
    db.updateAverage(tripID, newRating, (data, err) => {
      if (!err) {
        res.redirect('/trip/get/' + tripID)
      } else {
        req.flash('message', 'Error: ' + err) 
        req.flash('message', null)
        res.redirect('/trip/get/' + tripID)
      }
    })
  })

  // get trip by user
  router.get('/user', (req, res) => {
    const userID = req.session.user
    db.getTripByUser(userID, (data, err) => {
      if (!err) { 
        res.json(data)
      } else {
        res.send('DB ERROR: ' + err)
      }
    })
  })

  // delete a certain trip ID
  router.post('/delete', (req, res) => {
    const tripID = req.body.tripID
    db.deleteTrip(tripID, (message, err) => {
      if (!err) {
        res.send(message)
      } else {
        res.send('DB ERROR: ' + err)
      }
    })
  })

  // add a trip ID
  router.post('/create', (req, res) => {
    const { location, img, keywordList } = req.body
    let keywords = keywordList.split(',')

    db.getNumTrips((count, err) => {
      if (!err) {
        // add to trip using req.body JSON + next ID
        db.addTrip(
          count + 1,
          location,
          img,
          [],
          keywords,
          req.session.user,
          (data, err) => {
            if (!err) {
              req.flash('message', null)
              req.flash('validate', 'Added ' + location + '!')
              res.redirect('/create')
            } else {
              // find some way to render the data
              req.flash('message', 'Error: ' + err)
              req.flash('validate', null)
              res.redirect('/create')
            }
          }
        )
      } else {
        req.flash('message', 'Error: ' + err)
        req.flash('validate', null)
        res.redirect('/create')
      }
    })
  })

  // add site to existing location
  router.post('/addPlace/:tripID', (req, res) => {
    const tripID = req.params.tripID
    const { name, category, price, interested, visited } = req.body
    let interestedResult = []
    let visitedResult = []
    
    // error checking for blanks
    if (!(name && category && price)) {
      req.flash('message', 'Fields must be non-empty!')
      req.flash('validate', null)
      res.redirect('/trip/get/'+tripID)
    }

    if (interested === 'on') {
      interestedResult = [req.session.user]
    } else {
      interestedResult = []
    }
    if (visited === 'on') {
      visitedResult = [req.session.user]
    } else {
      visitedResult = []
    }

    db.addPlace(tripID, name, category, price, interestedResult, visitedResult, (data, err) => {
      if (!err) {
        req.flash('message', null)
        req.flash('validate', 'Added ' + name)
      } else {
        req.flash('message', 'Error: unable to add place!')
        req.flash('validate', null)
      }
      res.redirect('/trip/get/' + tripID)
    })
  })

  
  // update user preferences
  router.post('/update/:tripID/:userID', (req, res) => {
    // tripID is for this trip
    // userID is current user (req.session.user)
    const { tripID, userID } = req.params

    // these are the user's selections - update trip[tripID].places.interested, visited
    db.updatePlaces(tripID, userID, req.body, (data, err) => {
      if (err) {
        req.flash('message', 'Error: ' + err)
        req.flash('validate', null)
      } else {
        req.flash('message', null)
        req.flash('validate', 'Updated your information!')        
      }
      // redirect and refresh
      res.redirect('/trip/get/' + tripID)
    })
  })

  // view all location
  router.get('/all', (req, res) => {
    // don't let a non-logged in user view
    if (!req.session.user || req.session.user.length === 0) {
      // need an error msg
      req.flash('message', 'Please log in first!')
      req.flash('validate', null)
      res.redirect('/')
    } else {
      db.getAllTrips((data, err) => {
        if (!err) {
          req.flash('user', req.session.user)
          console.log(data.length)
          if (data.length === 0) {
            req.flash('data', null)
          } else {
            req.flash('data', data)
          }
          res.render('list.ejs', {
            user: req.flash('user'),
            data: req.flash('data'),
            message: req.flash('message'),
            validate: req.flash('validate')
          })
        } else {
          req.flash('message', 'Error: ' + err) 
          req.flash('validate', null)
          res.redirect('/')
        }
      })
    }
  })
  
  return router
}