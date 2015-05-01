var express = require('express');
var passport = require('../passports/passport.js')
var router = express.Router();
var redis = require('redis'),
client = redis.createClient(6379, '54.67.18.228', {})
var geolib = require('geolib')
var JsonResponse = require('../objects/jsonresponse')
var user_db = require('mongoskin').db('mongodb://54.153.62.38:27017/User');
var ObjectID = require('mongoskin').ObjectID

var proximity = require('geo-proximity').initialize(client)

//TODO: On request, check for the closest person and send a push notification to the person. 
//      Write a confirmation to the user. 
router.get('/neighbors', ensureAuthenticated, function(req, res, next) {
  var longitude = req.query.longitude
  var latitude = req.query.latitude
  var range = req.query.range
  var uid = req.user._id
  proximity.nearby(parseFloat(latitude), parseFloat(longitude), range, {values : true}, function(err, locations){
    if(err) console.error(err)
      else {
        if (locations){
          var result = []
          var target_location = {longitude: parseFloat(longitude), latitude: parseFloat(latitude)}
          if (locations.length!= 1){ 
            for(var i in locations) {
              if (locations[i][0] != uid){
                console.log("locations[i]", locations[i])
                var obj = { uid :locations[i][0],  longitude:locations[i][2] , latitude: locations[i][1]}
                result.push(obj)   
              } 
            };
          }else{
            if (locations[0][0] != uid){
              var obj = {uid :locations[0][0], longitude:locations[0][2] , latitude: locations[0][1]}
              result.push(obj) 
            }
          }
          console.log("result",result)
          var json = new JsonResponse(result, "location", "www.picmiapp.com" + req.originalUrl, req.method, req.user._id, null)
        //console.log(json)
        res.json(json)
      }else{
        var json = new JsonResponse(null, "location", "www.picmiapp.com" + req.originalUrl, req.method, req.user._id, "No neighbor found")
        res.json(json)
      }
    }
  })
});

router.get('/neighbor', ensureAuthenticated, function(req, res, next) {
  var longitude = req.query.longitude
  var latitude = req.query.latitude
  var range = req.query.range
  var uid = req.user._id
  if (req.query.exception) {
    var exception = req.query.exception
    // Now exception is a string that consists of a number of filter location
    var e_uids = exception.split(",");
    console.log(e_uids)
  }
  console.log("directory:" + __dirname)
  proximity.nearby(parseFloat(latitude), parseFloat(longitude), range, {values : true}, function(err, locations){
    if(err) console.error(err)
      else {
        if (locations){
          var result = {}
          var target_location = {longitude: parseFloat(longitude), latitude: parseFloat(latitude)}
          console.log("target_location", target_location)
          console.log("location", locations.length)
          if (locations.length!= 1){ 
            for(var i in locations) {
              if (locations[i][0] != uid){
                console.log("locations[i]", locations[i])
                var obj = {longitude:locations[i][2] , latitude: locations[i][1]}
                result[(locations[i][0])] =  obj   
              } 
            };
          }else{
            if (locations[0][0] != uid){
              var obj = {longitude:locations[0][2] , latitude: locations[0][1]}
              result[(locations[0][0])] =  obj
            }
          }

          if (req.query.exception){
            for (var i in e_uids){
              delete result[e_uids[i]]
            }
          }

          console.log("result", result)
          var closest = geolib.findNearest(target_location, result, 0)
          console.log("closest", closest)
        //TODO: Get the UID from here and send a puch notification!!
        var json = new JsonResponse(closest, "location", "www.picmiapp.com" + req.originalUrl, req.method, req.user._id, null)
        res.json(json)
        //console.log(closest)
      }else{
        var json = new JsonResponse(null, "location", "www.picmiapp.com" + req.originalUrl, req.method, req.user._id, "No neighbor found")
        res.json(json)
      }
    }
  })
});

router.get('/user', ensureAuthenticated, function(req, res, next) {
	proximity.location(req.user._id, function(err, location){
    if(err) console.error(err)
      else res.send(location.name + "'s location is:"+ location.latitude + " " + location.longitude)
    })
});

function ensureAuthenticated(req, res, next) {
  if (req.user) { 
  	return next(); 
  }
  res.redirect('/');
}

module.exports = router;