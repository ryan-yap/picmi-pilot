var express = require('express');
var passport = require('../passports/passport.js');
var router = express.Router();
var Photo = require('../objects/photo')


var user_db = require('mongoskin').db('mongodb://54.153.62.38:27017/Photo');
var ObjectID = require('mongoskin').ObjectID

	/* GET users listing. */
	router.get('/', ensureAuthenticated, function(req, res, next) {
		console.log(req.param)
	});

	router.post('/', ensureAuthenticated, function(req, res, next){
		var new_photo = new Photo(req.body.files, req.user._id, req.body.recipient, req.body.timestamp);
		new_photo.intsert();
	});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { 
  	return next(); 
  }
  res.redirect('/');
}

module.exports = router;
