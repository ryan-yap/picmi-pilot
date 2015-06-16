var express = require('express');
var passport = require('../passports/passport.js');
var router = express.Router();
var JsonResponse = require('../objects/jsonresponse')
var user_db = require('mongoskin').db('mongodb://54.153.62.38:27017/Stream');
var Stream = require('../objects/stream')
var ObjectID = require('mongoskin').ObjectID
var OpenTok = require('opentok'),
opentok = new OpenTok("45237302", "6bf065aa110c3c335945d57fa4e4969aee1a24ab");

router.get('/', ensureAuthenticated, function(req, res, next) {
	opentok.createSession(function(err, session) {
		if (err) return console.log(err);
	});
});

router.post('/', ensureAuthenticated, function(req, res, next){
	var user_id = req.body.user_id
	var driver_id = req.user._id
	opentok.createSession(function(err, session) {
		token = session.generateToken({
			role :       'publisher',
  			expireTime : (new Date().getTime() / 1000)+(10 * 60), // in ten minutes
  			data :       ''
		});
		var new_stream = new Stream(user_id, driver_id, session.sessionId, token)
		new_stream.insert()
		var json = new JsonResponse(new_stream, "stream", "www.picmiapp.com" + req.originalUrl, req.method, req.user._id, null)
		res.json(json);
	});
});

function ensureAuthenticated(req, res, next) {
	if (req.user) { 
		return next(); 
	}
	res.redirect('/');
}

module.exports = router;