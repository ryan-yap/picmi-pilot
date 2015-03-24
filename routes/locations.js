var express = require('express');
var passport = require('../passports/passport.js')
var router = express.Router();
var redis = require('redis'),
    client = redis.createClient()

var proximity = require('geo-proximity').initialize(client)

router.get('/', ensureAuthenticated, function(req, res, next) {
	proximity.addLocation(43.6667, -79.4167, req.user._id, function(err, reply){
  		if(err) console.error(err)
  		else res.send('added location:'+ reply)
	})
});

router.get('/user', ensureAuthenticated, function(req, res, next) {
	proximity.location(req.user._id, function(err, location){
  		if(err) console.error(err)
  		else res.send(location.name + "'s location is:"+ location.latitude + " " + location.longitude)
	})
});

function ensureAuthenticated(req, res, next) {
  if (req.user) { 
  	return next(); 
  }
  res.redirect('/');
}

module.exports = router;