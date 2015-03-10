var express = require('express');
var passport = require('../passports/passport.js')
var router = express.Router();


// router.route('/')
// 	.all(function(req, res, next) {
// 	  // runs for all HTTP verbs first
// 	  // think of it as route specific middleware!
// 	  next();
// 	})

// 	.get(function(req, res, next) {
// 	  res.send("GET User Request");
// 	})

// 	.put(function(req, res, next) {
// 	  res.send("PUT User Request");
// 	})

// 	.post(function(req, res, next) {
// 	  res.send("POST User Request");
// 	})

	/* GET users listing. */
	router.get('/', function(req, res, next) {
	  res.send('respond with a resource');
	});

	router.post('/', passport.authenticate('signup'), function(req, res, next){
		res.send('post request to /user')
	});

module.exports = router;
