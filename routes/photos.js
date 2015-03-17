var express = require('express');
var passport = require('../passports/passport.js');
var router = express.Router();
var Photo = require('../objects/photo')
var AWS = require('aws-sdk'); 
var ObjectID = require('mongoskin').ObjectID
var s3 = new AWS.S3(); 

// AWS.config.update({
//     accessKeyId: "AKIAICVKGCDJ6XYSVS6Q",
//     secretAccessKey: "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",
//     //"region": "us-west-1"
// });

/* GET users listing. */
router.get('/', ensureAuthenticated, function(req, res, next) {
	var params = {
 	 	Bucket: 'picmi-photo', /* required */
  		//Key: 'photo/', /* required */
	};
	// s3.getSignedUrl('getObject', params, function (err, url) {
 //  		console.log("error:",err)
 //  		console.log(url)
	// });
	s3.listObjects(params, function(err, data) {
	  if (err) console.log(err, err.stack); // an error occurred
	  else     console.log(data);           // successful response
	});

	res.send("Photo");
});

router.get('/upload', ensureAuthenticated, function(req, res, next){
	var html_temp = '<form action="UPLOADURL" method="post" enctype="multipart/form-data"><input type="file" name="pic" accept="image/*"><input type="submit"></form>'
	var params = {Bucket: 'picmi-photo', Key: 'photo/', Expires: 3600, ACL: "public-read", ContentType: "image/jpeg"};
	s3.getSignedUrl('putObject', params, function (err, url) {
  		console.log(err);
  		var html = html_temp.replace("UPLOADURL", url);
		console.log(url)
		res.send(html)
	});
})

router.post('/', ensureAuthenticated, function(req, res, next){
	var new_photo = new Photo(req.body.files, req.user._id, req.body.recipient, req.body.timestamp);
	new_photo.intsert();
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { 
  	return next(); 
  }
  res.redirect('/');
}

module.exports = router;
