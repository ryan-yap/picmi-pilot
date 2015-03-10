var express = require('express');
var passport = require('../passports/passport.js')
var router = express.Router();

	/* GET users listing. */
	router.get('/', ensureAuthenticated, function(req, res, next) {
	  res.send('respond with a resource');
	});

	router.post('/', passport.authenticate('agent-signup'), function(req, res, next){
		res.send('post request to /user')
	});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/');
}

module.exports = router;