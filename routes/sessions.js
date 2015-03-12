var express = require('express');
var passport = require('../passports/passport.js')
var router = express.Router();

//HTTP 1.1 GET Request Handler
router.get('/', function(req, res, next) {
  	res.send('Test');
});

router.post('/users', passport.authenticate('user-login'), function(req, res, next){
	//console.log(req.user)
	res.send('<br><form action="/users"><input type="submit" value="Retrieve your user information"> </form>');
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