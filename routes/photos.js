var express = require('express');
var passport = require('../passports/passport.js');
var router = express.Router();
var Photo = require('../objects/photo')
var AWS = require('aws-sdk'); 
var ObjectID = require('mongoskin').ObjectID
var s3 = new AWS.S3(); 
var photo_db = require('mongoskin').db('mongodb://54.153.62.38:27017/Photo');
// AWS.config.update({
//     accessKeyId: "AKIAICVKGCDJ6XYSVS6Q",
//     secretAccessKey: "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",
//     //"region": "us-west-1"
// });

/* GET users listing. */
router.get('/:RID/:UID', ensureAuthenticated, function(req, res, next) {
	if (req.params.RID != req.user._id){
		res.send("Permission Denied");
	}else{
		photo_db.collection('album').find({recipient:req.params.RID, uploader: req.params.UID}).toArray(
			function(err, result) {
	       		res.json(result)
			}
		);
	}
});

router.get('/:RID', ensureAuthenticated, function(req, res, next) {
	if (req.params.RID != req.user._id){
		res.send("Permission Denied");
	}else{
		photo_db.collection('album').find({recipient:req.params.RID}).toArray(
			function(err, result) {
	       		res.json(result)
			}
		);
	}
});

router.get('/', ensureAuthenticated, function(req, res, next) {
	res.send('Please provide paramters')
});

router.get('/upload', ensureAuthenticated, function(req, res, next){
	var time = Date.now()
	var uid = req.query.UID
	var rid = req.query.RID
	var key = "photo/"+ rid + "/" + uid + "/" + time.toString();

	var newPhoto = new Photo(key, uid, rid, time);

	var html_temp = '<form action="UPLOADURL" method="post" enctype="multipart/form-data"><input type="file" name="pic" accept="image/*"><input type="submit"></form>'
	var params = {Bucket: 'picmi-photo', Key: key, Expires: 3600, ACL: "public-read", ContentType: "image/jpeg"};
	s3.getSignedUrl('putObject', params, function (err, url) {
  		if (err) {
  			console.log(err);
  		}
  		else{
	  		var html = html_temp.replace("UPLOADURL", url);
	  		newPhoto.insert()
			console.log(url)
			console.log('Now run from console for upload:\n\ncurl -v -H "Content-Type: image/jpeg" -T /home/ryan/Pictures/capbridge.jpg \'' + url + '\'');
			res.send(html)
		}
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
