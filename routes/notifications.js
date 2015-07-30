var express = require('express');
var passport = require('../passports/passport.js');
var fs = require('fs')
var router = express.Router();
var JsonResponse = require('../objects/jsonresponse')
var noti_db = require('mongoskin').db('mongodb://52.8.188.79:27017/Notification');
var user_db = require('mongoskin').db('mongodb://52.8.188.79:27017/User');
var job_db = require('mongoskin').db('mongodb://52.8.188.79:27017/Job');
var ObjectID = require('mongoskin').ObjectID
var apn = require('apn');
var Notification = require('../objects/notification')
var Job = require('../objects/job')

var service = new apn.connection({
	cert: __dirname + "/credentials/cert.pem.development",
	key: __dirname + "/credentials/key.pem.development",
	production: true,
	passphrase: null,   
	gateway: "gateway.sandbox.push.apple.com",              
	port: 2195,                         
	enhanced: true,                     
	errorCallback: undefined,                       
	cacheLength: 5
});

router.get('/test', function(req, res, next) {
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
	note.contentAvailable = true
	note.payload = json_obj
	service.pushNotification(note, tokens);
	var json = new JsonResponse(json_obj, "Notification", "www.picmiapp.com" + req.originalUrl, req.method, req.user._id, null)
	res.json(json);
});

router.post('/driver', ensureAuthenticated, function(req, res, next){
	var jsonObject = req.body
	var alert = "Photo Request"
	var uid = jsonObject.driver_id
	console.log(jsonObject)
	var job = new Job(jsonObject.distance, jsonObject.location_name, jsonObject.message, jsonObject.objecttype, jsonObject.longitude, jsonObject.latitude, jsonObject.jobID, jsonObject.requester_id, jsonObject.driver_id, jsonObject.username, "")
	job.insert()
	var noti = new Notification(alert,uid,jsonObject, false)
	noti.insert(push_notification)
	var json = new JsonResponse(jsonObject, "Notification", "www.picmiapp.com" + req.originalUrl, req.method, req.user._id, null)
	res.json(json);
});

router.post('/user', ensureAuthenticated, function(req, res, next){
	var jsonObject = req.body
	var alert = "Photo Response"
	var uid = jsonObject.requester_id
	console.log(jsonObject)
	var noti = new Notification(alert,uid,jsonObject, false)
	noti.insert(push_notification)
	var json = new JsonResponse(jsonObject, "Notification", "www.picmiapp.com" + req.originalUrl, req.method, req.user._id, null)
	res.json(json);
});

router.post('/driver/accept', ensureAuthenticated, function(req, res, next){
	var jsonObject = req.body
	var alert = "Request Accepted"
	var uid = jsonObject.requester_id
	console.log(jsonObject)
	var noti = new Notification(alert,uid,jsonObject, false)
	noti.insert(push_notification)
	var json = new JsonResponse(jsonObject, "Notification", "www.picmiapp.com" + req.originalUrl, req.method, req.user._id, null)
	res.json(json);
});

router.post('/driver/decline', ensureAuthenticated, function(req, res, next){
	var jsonObject = req.body
	var alert = "Request Declined"
	var uid = jsonObject.requester_id
	console.log(jsonObject)
	var noti = new Notification(alert,uid,jsonObject, false)
	noti.insert(push_notification)
	var json = new JsonResponse(jsonObject, "Notification", "www.picmiapp.com" + req.originalUrl, req.method, req.user._id, null)
	res.json(json);
});

router.post('/user/cancel', ensureAuthenticated, function(req, res, next){
	var jsonObject = req.body
	var alert = "Job Cancelled"
	var uid = jsonObject.driver_id
	console.log(jsonObject)
	var noti = new Notification(alert,uid,jsonObject, false)
	noti.insert(push_notification)
	var json = new JsonResponse(jsonObject, "Notification", "www.picmiapp.com" + req.originalUrl, req.method, req.user._id, null)
	res.json(json);
});

router.post('/user/end', ensureAuthenticated, function(req, res, next){
	var jsonObject = req.body
	var alert = "Transaction Ended"
	var uid = jsonObject.requester_id
	console.log(jsonObject)
	var noti = new Notification(alert,uid,jsonObject, false)
	noti.insert(push_notification)
	var json = new JsonResponse(jsonObject, "Notification", "www.picmiapp.com" + req.originalUrl, req.method, req.user._id, null)
	res.json(json);
});

router.post('/user/stream/start', ensureAuthenticated, function(req, res, next){
	var jsonObject = req.body
	var alert = "Stream Request"
	var uid = jsonObject.requester_id
	console.log(jsonObject)
	var noti = new Notification(alert,uid,jsonObject, false)
	noti.insert(push_notification)
	var json = new JsonResponse(jsonObject, "Notification", "www.picmiapp.com" + req.originalUrl, req.method, req.user._id, null)
	res.json(json);
});

router.delete('/:id', ensureAuthenticated, function(req, res, next){
	var noti_id = req.params.id
	noti_db.collection('notification').remove({_id:ObjectID(noti_id)}, function(err, result) {
		if (!err){
			var json = new JsonResponse(result, "Notification", "www.picmiapp.com" + req.originalUrl, req.method, req.user._id, null)
			res.json(json);
		}
	});
});

router.get('/', ensureAuthenticated, function(req, res, next){
	var uid = req.user._id
	console.log(uid)

	noti_db.collection('notification').find({recipient_id:uid}).sort({timestamp:-1}).toArray(
		function(err, result) {
			if (!err){
				/*for(var i in result) {
					noti_db.collection('notification').update({_id:ObjectID(result[i]._id)}, {$set:{notified:true}}, function(err, result) {
						console.log(err, result)
					})
				}*/
				var json = new JsonResponse(result, "Notification", "www.picmiapp.com" + req.originalUrl, req.method, req.user._id, null)
				res.json(json);
			}
		});
});

router.put('/:id', ensureAuthenticated, function(req, res, next){
	var noti_id = req.params.id
	console.log(noti_id)
	noti_db.collection('notification').update({_id:ObjectID(noti_id)}, {$set:{notified:true}}, function(err, result) {
		console.log(err, result)
		var json = new JsonResponse(result[0], "Notification", "www.picmiapp.com" + req.originalUrl, req.method, req.user._id, null)
		res.json(json);
	})
});

router.get('/sample', ensureAuthenticated, function(req, res, next){
	var uid = req.user._id
	var noti = new Notification("SAMPLE",uid,{
		"Hello" : {
			"me" : "you"
		}
	}, false)
	noti.insert()
	var json = new JsonResponse(noti, "Notification", "www.picmiapp.com" + req.originalUrl, req.method, req.user._id, null)
	res.json(json);
});


function push_notification(noti){
	var note = new apn.notification();
	var tokens = []
	user_db.collection('device_token').find({_id:ObjectID(noti.recipient_id)}).toArray(
		function(err, result) {
			console.log (result[0].token)
			tokens.push(result[0].token)
			note.setAlertText(noti.noti_type);
			note.badge = 1;
			note.contentAvailable = true;
			note.payload = noti;
			service.pushNotification(note, tokens);
		});
}

function ensureAuthenticated(req, res, next) {
	if (req.user) { 
		return next(); 
	}
	res.redirect('/');
}

module.exports = router;