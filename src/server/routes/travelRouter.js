const router = require('express').Router()

// db parameter allows router to have access to database from api.js
module.exports = (db) => {
  // should we include search?

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
            req.flash('message', 'Error: ' + err) 
            req.flash('validate', null)
            res.redirect('/')
          }
        })
      } else {
        req.flash('message', 'Error: ' + err) 
        req.flash('validate', null)
        res.redirect('/')
      }
    })
  })

  // get all trips
  router.get('/all', (req, res) => {
    db.getAllTrips((data, err) => {
      if (!err) {
        res.json(data)
      } else {
        req.flash('message', 'Error: ' + err) 
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
            message: req.flash('message')
          })
        }
      } else {
        req.flash('message', 'Error: ' + err) 
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
    db.getNumTrips((count, err) => {
      if (!err) {
        // add to trip using req.body JSON + next ID
        db.addTrip(
          count + 1,
          req.body.location,
          req.body.img,
          req.body.places,
          req.body.keywords,
          req.session.user,
          (data, err) => {
            if (!err) { 
              res.json(data)
            } else {
              // find some way to render the data
              res.send('CREATE ERROR: ' + err)
            }
          }
        )
      } else {
        res.send('DB ERROR: ' + err)
      }
    })
  })

  // add site to existing location
  router.post('/addPlace', (req, res) => {
    const { tripID, name, category, price } = req.body
    db.addPlace(tripID, name, category, price, (data, err) => {
      if (!err) {
        res.json(data)
      } else {
        res.send('DB ERROR: ' + err)
      }
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
      }
      // redirect and refresh
      res.redirect('/trip/get/' + tripID)
    })
  })

  return router
}