var express = require('express');
var passport = require('../passports/passport.js')
var router = express.Router();
var Agent = require('../objects/agent')
var Profile = require('../objects/profile')
var Agent_Payment = require('../objects/agent_payment')

	/* GET users listing. */
	router.get('/', ensureAuthenticated, function(req, res, next) {
	  res.send('respond with a resource');
	});

	router.post('/', passport.authenticate('agent-signup'), function(req, res, next){
		var agent = new Agent(req.user.username, req.user.password)
		agent.profile = new Profile(req.body.firstname, req.body.lastname, req.body.email, req.body.mobile_number)
		agent.insert_profile(req.user._id)
		agent.payment_method = new Agent_Payment(req.body.payment_method)
		agent.payment_method.insert(req.user._id)
		res.send('post request to /agent')
	});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/');
}

module.exports = router;