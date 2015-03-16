var express = require('express');
var passport = require('../passports/passport.js');
var router = express.Router();
var Photo = require('../objects/photo')
var AWS = require('aws-sdk'); 
AWS.config.region = 'us-west-2';
var ObjectID = require('mongoskin').ObjectID
var s3 = new AWS.S3(); 

AWS.config.update({
    accessKeyId: "AKIAI2MWE2V5KMIVBKGA",
    secretAccessKey: "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"
});

/* GET users listing. */
router.get('/', ensureAuthenticated, function(req, res, next) {
	console.log(req.param)
});

router.get('/upload', ensureAuthenticated, function(req, res, next){
	AWS.config.update({
    accessKeyId: "AKIAI2MWE2V5KMIVBKGA",
    secretAccessKey: "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"
});
	var html_temp = '<form action="UPLOADURL"><input type="file" name="pic" accept="image/*"><input type="submit"></form>'
	var params = {Bucket: 'picmi-photo', Key: 'test'};
	s3.getSignedUrl('putObject', params, function (err, url) {
  		console.log('The URL is', err);
  		var html = html_temp.replace("UPLOADURL", url);
		console.log(html)
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
