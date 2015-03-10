var express = require('express');
var passport = require('../passports/passport.js')
var router = express.Router();
var User = require('../objects/user')
var Profile = require('../objects/profile')

	/* GET users listing. */
	router.get('/', ensureAuthenticated, function(req, res, next) {
		res.send('respond with a resource');
	});

	router.post('/', passport.authenticate('user-signup'), function(req, res, next){
		var user = new User(req.user.username, req.user.password)
		user.profile = new Profile(req.body.firstname, req.body.lastname, req.body.email, req.body.mobile_number)
		user.profile.insert(req.user._id)
		res.send('post request to /user')
	});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/');
}

module.exports = router;
