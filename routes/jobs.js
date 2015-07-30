var express = require('express');
var passport = require('../passports/passport.js');
var router = express.Router();
var Job = require('../objects/job')
var JsonResponse = require('../objects/jsonresponse')
var ObjectID = require('mongoskin').ObjectID
var job_db = require('mongoskin').db('mongodb://52.8.188.79:27017/Job');

router.get('/jobs', ensureAuthenticated, function(req, res, next) {
	var id = req.user._id
	job_db.collection('jobs').find({driver_id: id}).toArray(function(err, result) {
		var json = new JsonResponse(result, "Job", "www.picmiapp.com" + req.originalUrl, req.method, req.user._id, null)
		res.json(json);
	});
});

router.get('/requests', ensureAuthenticated, function(req, res, next) {
	var id = req.user._id
	job_db.collection('jobs').find({requester_id: id}).toArray(function(err, result) {
		var json = new JsonResponse(result, "Job", "www.picmiapp.com" + req.originalUrl, req.method, req.user._id, null)
		res.json(json);
	});
});

router.post('/', ensureAuthenticated, function(req, res, next) {
	var jsonObject = req.body
	job_db.collection('jobs').find({jobID:jsonObject.jobID, requester_id: jsonObject.requester_id}).toArray(function(err, result) {
		if(result[0]){
			job_db.collection('jobs').update({jobID:jsonObject.jobID, requester_id: jsonObject.requester_id}, {'$set':{driver_id:jsonObject.driver_id, distance:jsonObject.distance}}, function(err) {
				if (err) throw err;
			});
		}else{
			var job = new Job(jsonObject.distance, jsonObject.location_name, jsonObject.message, jsonObject.objecttype, jsonObject.longitude, jsonObject.latitude, jsonObject.jobID, jsonObject.requester_id, jsonObject.driver_id, jsonObject.username, "")
			job.insert()
		}
	});
	var json = new JsonResponse(jsonObject, "Job", "www.picmiapp.com" + req.originalUrl, req.method, req.user._id, null)
	res.json(json);
});

router.put('/', ensureAuthenticated, function(req, res, next) {
	var jsonObject = req.body
	job_db.collection('jobs').update({jobID:jsonObject.jobID, requester_id: jsonObject.requester_id}, {'$set':{driver_name:jsonObject.username, isResponded:true}}, function(err) {
		if (err) throw err;
	});
	var json = new JsonResponse(jsonObject, "Job", "www.picmiapp.com" + req.originalUrl, req.method, req.user._id, null)
	res.json(json);
});

router.delete('/', ensureAuthenticated, function(req, res, next) {
	var jsonObject = req.body
	job_db.collection('jobs').remove({jobID:jsonObject.jobID, requester_id: jsonObject.requester_id}, function(err, result) {
	    if (!err) console.log('VR deleted!');
	});
	var json = new JsonResponse(jsonObject, "Job", "www.picmiapp.com" + req.originalUrl, req.method, req.user._id, null)
	res.json(json);
});

function ensureAuthenticated(req, res, next) {
  if (req.user) { 
  	return next(); 
  }
  res.redirect('/');
}

module.exports = router;
