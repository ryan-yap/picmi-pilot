var express = require('express');
var passport = require('../passports/passport.js')
var router = express.Router();
var User = require('../objects/user')
var Profile = require('../objects/profile')
var Payment = require('../objects/payment')
var Banking = require('../objects/banking')
var user_db = require('mongoskin').db('mongodb://52.11.66.117:27017/User');
var ObjectID = require('mongoskin').ObjectID

	/* GET users listing. */
	router.get('/', ensureAuthenticated, get_user, function(req, res, next) {
		res.json(req.user_info);
	});

	router.post('/', passport.authenticate('user-signup'), function(req, res, next){
		var user = new User(req.user.username, req.user.password)
		user.profile = new Profile(req.body.firstname, req.body.lastname, req.body.email, req.body.mobile_number)
		user.profile.insert_profile(req.user._id);
		if(req.body.isUser == "true"){
			user.insert_profile(req.user._id)
			user.payment = new Payment(req.body.card_number, req.body.cvv, req.body.exp_date, req.body.postal_code)
			user.payment.insert(req.user._id)
		}

		if(req.body.isDriver == "true"){		
			user.banking = new Banking(req.body.payment_method)
			user.banking.insert(req.user._id)
		}

		res.send('<br><form action="/users"><input type="submit" value="Retrieve your user information"> </form>');
	});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { 
  	return next(); 
  }
  res.redirect('/');
}

function get_user(req, res, next) {
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
				       		req.user_info = user;
				       		return next();
				    });
		    });
    });
}

module.exports = router;
