var express = require('express');
var passport = require('../passports/passport.js')
var router = express.Router();

//HTTP 1.1 GET Request Handler
router.get('/', ensureAuthenticated, function(req, res, next) {
	console.log(req.user)
  	res.send('respond with a sessions resource');
});

router.post('/', passport.authenticate('login'), function(req, res, next){
	//console.log(req.user)
	res.send('post request to /sessions')
});

router.delete('/', ensureAuthenticated, function(req, res, next){
	req.logout()
	res.send('delete request to /sessions')
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/');
}

module.exports = router