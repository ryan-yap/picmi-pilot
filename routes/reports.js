var express = require('express');
var passport = require('../passports/passport.js');
var router = express.Router();
var JsonResponse = require('../objects/jsonresponse')
var report_db = require('mongoskin').db('mongodb://54.153.62.38:27017/Report');
var Report = require('../objects/report')
var ObjectID = require('mongoskin').ObjectID

router.get('/', ensureAuthenticated, function(req, res, next) {

});

router.post('/', ensureAuthenticated, function(req, res, next){
	var user_id = req.user._id
	var message = req.body.message
	var category = req.body.category
	var report = new Report(user_id, message, category)
	report_db.collection('bugs').insert(report, function(err, result) {
	  	if (err){ 
	  		throw err; 
	  	}
	  	var json = new JsonResponse(report, "report", "www.picmiapp.com" + req.originalUrl, req.method, req.user._id, null)
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