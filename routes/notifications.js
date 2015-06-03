var express = require('express');
var passport = require('../passports/passport.js');
var fs = require('fs')
var router = express.Router();
var JsonResponse = require('../objects/jsonresponse')
var noti_db = require('mongoskin').db('mongodb://54.153.62.38:27017/Notification');
var user_db = require('mongoskin').db('mongodb://54.153.62.38:27017/User');
var ObjectID = require('mongoskin').ObjectID
var apn = require('apn');
var service = new apn.connection({
    cert: __dirname + "/credentials/cert.pem",
    key: __dirname + "/credentials/key.pem",
    production: false,
    passphrase: null,   
    gateway: "gateway.sandbox.push.apple.com",              
    port: 2195,                         
    enhanced: true,                     
    errorCallback: undefined,                       
    cacheLength: 5
});

router.get('/', function(req, res, next) {
	var token = req.query.token
	dir = fs.readdirSync(__dirname + "/credentials")
	console.log(__dirname + "/credentials")
	console.log(dir)
	console.log(token)

	var json_obj = {
    	"Hello" : {
    		"me" : "you"
    	}
    }

	var note = new apn.notification();
	var tokens = []
	tokens.push(token)
    note.setAlertText("Hello, from node-apn!");
    note.badge = 3;
    note.sound = "ping.aiff";
    note.payload = json_obj
    service.pushNotification(note, tokens);
    
	var json = new JsonResponse(json_obj, "Notification", "www.picmiapp.com" + req.originalUrl, req.method, req.user._id, null)
	res.json(json);
});

router.post('/driver', ensureAuthenticated, function(req, res, next){
	var jsonObject = req.body
	var alert = "Photo Request"
	var uid = jsonObject.key
	console.log(jsonObject)
	var note = new apn.notification();
	var tokens = []
	user_db.collection('device_token').find({_id:ObjectID(uid)}).toArray(
		function(err, result) {
			console.log (result[0].token)
			tokens.push(result[0].token)
    		note.setAlertText(alert);
    		note.badge = 1;
    		note.payload = jsonObject
    		service.pushNotification(note, tokens);
	});

	var json = new JsonResponse(jsonObject, "Notification", "www.picmiapp.com" + req.originalUrl, req.method, req.user._id, null)
	res.json(json);
});

function ensureAuthenticated(req, res, next) {
	if (req.user) { 
		return next(); 
	}
	res.redirect('/');
}

module.exports = router;