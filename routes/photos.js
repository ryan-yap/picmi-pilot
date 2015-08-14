var express = require('express');
var passport = require('../passports/passport.js');
var router = express.Router();
var Photo = require('../objects/photo')
var AWS = require('aws-sdk'); 
var JsonResponse = require('../objects/jsonresponse')
var ObjectID = require('mongoskin').ObjectID
var s3 = new AWS.S3(); 
var photo_db = require('mongoskin').db('mongodb://52.8.188.79:27017/Photo');
var user_db = require('mongoskin').db('mongodb://52.8.188.79:27017/User');
AWS.config.update({
    accessKeyId: "AKIAICVKGCDJ6XYSVS6Q",
    secretAccessKey: "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",
    //"region": "us-west-1"
});

//TODO: Need to check if UID is a valid userid by checking the RID with user_db.
//The RID must match with the UID of the user who is making the request. This request returns the client a list of photo owned by the recipient.
//router.get('/:RID/:UID', ensureAuthenticated, function(req, res, next) {
// 	if (req.params.RID != req.user._id){
// 		// Return a error message in json format
// 		var json = new JsonResponse(null, "photo", "www.picmiapp.com/photos/"+req.params.RID+"/"+req.params.UID, "get", req.user._id, "Access Denied")
// 	    res.json(json)
// 	}else{
// 		photo_db.collection('album').find({recipient:req.params.RID, uploader: req.params.UID}).toArray(
// 			function(err, result) {
// 				var json = new JsonResponse(result, "photo", "www.picmiapp.com/photos"+req.params.RID+"/"+req.params.UID, "get", req.user._id, null)
// 	       		res.json(json)
// 			}
// 		);
// 	}
// });

// router.get('/:RID', ensureAuthenticated, function(req, res, next) {
// 	if (req.params.RID != req.user._id){
// 		var json = new JsonResponse(null, "photo", "www.picmiapp.com/photos/"+req.params.RID, "get", req.user._id, "Access Denied")
// 	    res.json(json)
// 	}else{
// 		photo_db.collection('album').find({recipient:req.params.RID}).toArray(
// 			function(err, result) {
// 				var json = new JsonResponse(result, "photo", "www.picmiapp.com/photos/"+req.params.RID, "get", req.user._id, null)
// 	       		res.json(json)
// 			}
// 		);
// 	}
// });

router.get('/', ensureAuthenticated, function(req, res, next) {
	var uid = req.query.UID
	var rid = req.user._id

	if (rid != req.user._id){
		// Return a error message in json format
		var json = new JsonResponse(null, "photo", "www.picmiapp.com" + req.originalUrl, req.method, req.user._id, "Access Denied")
	    res.json(json)
	    return
	}else{
		if (uid){
			photo_db.collection('album').find({recipient:rid, uploader: uid}).toArray(
				function(err, result) {
					var json = new JsonResponse(result, "photo", "www.picmiapp.com" + req.originalUrl, req.method, req.user._id, null)
		       		res.json(json)
		       		return
		       	}
		    );
		}else{
			photo_db.collection('album').find({recipient:rid}).toArray(
				function(err, result) {
					var json = new JsonResponse(result, "photo", "www.picmiapp.com" + req.originalUrl, req.method, req.user._id, null)
		       		res.json(json)
		       		return
				}
			);
		}
	}

	//res.status(204);
});

//TODO: make sure the parameter is provided and both UID and RID are valid userids.
//TODO: error handling 
router.get('/upload', ensureAuthenticated, function(req, res, next){

	if (req.query.RID == req.user._id){
		var json = new JsonResponse(null, "photo", "www.picmiapp.com" + req.originalUrl, req.method, req.user._id, "Access Denied")
	    res.json(json)
	    return
	}else{
		var time = Date.now()
		var uid = req.user._id;
		var rid = req.query.RID
		var key = "photo/"+ rid + "/" + uid + "/" + time.toString();

		var newPhoto = new Photo(key, uid, rid, time);

		var params = {Bucket: 'picmi-photo', Key: key, Expires: 180, ACL: "public-read", ContentType: "image/jpeg"};
		s3.getSignedUrl('putObject', params, function (err, url) {
	  		if (err) {
	  			console.log(err);
	  		}
	  		else{
		  		newPhoto.insert()
				console.log(url)
				var json = new JsonResponse({upload_url : url, timestamp : time.toString()}, "photo", "www.picmiapp.com" + req.originalUrl, req.method, req.user._id, null)
		       	res.json(json)
			}
		});
	}
})
//TODO: make sure the parameter is provided and both UID and RID are valid userids.
//TODO: error handling 
router.get('/profile/upload', ensureAuthenticated, function(req, res, next){
	var time = Date.now()
	var uid = req.user._id;
	var key = "profile/"+ uid + "/" + time.toString();

	var params = {Bucket: 'picmi-photo', Key: key, Expires: 180, ACL: "public-read", ContentType: "image/jpeg"};
	s3.getSignedUrl('putObject', params, function (err, url) {
  		if (err) {
  			console.log(err);
  		}
  		else{
			var json = new JsonResponse({upload_url : url, timestamp : time.toString()}, "photo", "www.picmiapp.com" + req.originalUrl, req.method, req.user._id, null)
	       	res.json(json)
		}
	});
})


function ensureAuthenticated(req, res, next) {
  if (req.user) { 
  	return next(); 
  }
  res.redirect('/');
}

module.exports = router;
