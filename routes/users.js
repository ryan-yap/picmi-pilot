var express = require('express');
var passport = require('../passports/passport.js')
var router = express.Router();
var User = require('../objects/user')
var Profile = require('../objects/profile')
var Payment = require('../objects/payment')
var Banking = require('../objects/banking')
var Device_Token = require('../objects/device_token')
var JsonResponse = require('../objects/jsonresponse')
var user_db = require('mongoskin').db('mongodb://54.153.62.38:27017/User');
var ObjectID = require('mongoskin').ObjectID

// Getting the user's information
router.get('/', ensureAuthenticated, function(req, res, next) {
	var uid = req.query.uid
	if (uid){
		user_db.collection('account').find({_id:ObjectID(uid)}).toArray(
			function(err, result) {
				delete result[0].password
				var json = new JsonResponse(result[0], "user", "www.picmiapp.com" + req.originalUrl, req.method, req.user._id, null)
				res.json(json);
		});
	}else{
		var user = new User(req.user.username, req.user.password)
		user_db.collection('profile').find({_id:ObjectID(req.user._id)}).toArray(
			function(err, result) {
	       		if(result[0]){
	       			user.profile=result[0]
	       		}
	       		user_db.collection('banking').find({_id:ObjectID(req.user._id)}).toArray(
					function(err, result) {
			       		if(result[0]){
			       			user.banking=result[0]
			       		}
			       		user_db.collection('payment').find({_id:ObjectID(req.user._id)}).toArray(
							function(err, result) {
					       		if(result[0]){
					       			user.payment=result[0]
					       		}
					       		
					       		var json = new JsonResponse(user, "user", "www.picmiapp.com" + req.originalUrl, req.method, req.user._id, null)
								res.json(json);
					    });
			    });
	    });
	}
});

router.get('/profile', ensureAuthenticated, function(req, res, next){
	var uid = req.query.uid
	if (uid){
		user_db.collection('profile').find({_id:ObjectID(uid)}).toArray(
			function(err, result) {
				var json = new JsonResponse(result[0], "profile", "www.picmiapp.com" + req.originalUrl, req.method, req.user._id, null)
				res.json(json);
		});
	}else{
		user_db.collection('profile').find({_id:ObjectID(req.user._id)}).toArray(
			function(err, result) {
	       		var json = new JsonResponse(result[0], "profile", "www.picmiapp.com" + req.originalUrl, req.method, req.user._id, null)
				res.json(json);
	    });
	}
})

// Creating a new user
router.post('/', passport.authenticate('user-signup'), function(req, res, next){
	var user = new User(req.user.username, req.user.password)
	user._id = req.user._id
	if (req.body.device_token){
		user.device_token = new Device_Token(req.body.device_token)
		user.device_token.insert(req.user._id)
	}
	user.profile = new Profile(req.body.firstname, req.body.lastname, req.body.email, req.body.mobile_number)
	user.insert_profile(req.user._id);
	if(req.body.isUser == "true"){
		user.payment = new Payment(req.body.card_number, req.body.cvv, req.body.exp_date, req.body.postal_code)
		user.payment.insert(req.user._id)
	}

	if(req.body.isDriver == "true"){		
		user.banking = new Banking(req.body.payment_method)
		user.banking.insert(req.user._id)
	}
	var json = new JsonResponse(user, "user", "www.picmiapp.com" + req.originalUrl, req.method, req.user._id, null)
	res.json(json);
});

//TODO: implement this function
router.put('/', ensureAuthenticated, function(req, res, next) {
	res.send("Modify user object")	
});

function ensureAuthenticated(req, res, next) {
  if (req.user) { 
  	return next(); 
  }
  res.redirect('/');
}

module.exports = router;
