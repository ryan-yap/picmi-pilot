var express = require('express');
var passport = require('../passports/passport.js')
var User = require('../objects/user')
var JsonResponse = require('../objects/jsonresponse')
var Device_Token = require('../objects/device_token')
var user_db = require('mongoskin').db('mongodb://52.8.188.79:27017/User');
var ObjectID = require('mongoskin').ObjectID
var router = express.Router();

// Return a logged in user's object to the client
router.get('/', ensureAuthenticated, function(req, res, next) {
  	var json = new JsonResponse(req.user, "session", "www.picmiapp.com"  + req.originalUrl, req.method, req.user._id, null)
	res.json(json);
});

// Create a logging in user object and returnt the logged in user object to the client.
router.post('/', passport.authenticate('user-login'), function(req, res, next){
	var user = new User(req.user.username, req.user.password)
	user._id = req.user._id;
	if (req.body.device_token){
		var device_token = new Device_Token(req.body.device_token)
		device_token.insert(req.user._id)
		user.device_token = device_token
	}

	user_db.collection('profile').find({_id:ObjectID(req.user._id)}).toArray(
		function(err, result) {
			user.profile = result[0]
			var json = new JsonResponse(user, "session", "www.picmiapp.com" + req.originalUrl, req.method, req.user._id, null)
			res.json(json);
		}
	);
});

// Currently do not allow user to modify session. Will be implemented if required.
router.put('/', ensureAuthenticated, function(req, res, next){
	res.status(405);
});

// Deleting a session for the user. Eg. logging the user out. 
router.delete('/', function(req, res, next){
	console.log("Logging out")
	req.logOut()
	console.log("Logging out")
	var json = new JsonResponse(null, "session", "www.picmiapp.com" + req.originalUrl, req.method, null, null)
	res.json(json);
});

function ensureAuthenticated(req, res, next) {
  if (req.user) { return next(); }
  var json = new JsonResponse(req.user, "session", "www.picmiapp.com" + req.originalUrl, req.method, req.user._id, null);
  res.json(json);
}

module.exports = router