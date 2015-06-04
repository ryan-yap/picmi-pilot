// Configurting Passport
// var expressSession = require('express-session');
var passport = require('passport')
var flash = require('connect-flash')
var LocalStrategy = require('passport-local').Strategy
var user_db = require('mongoskin').db('mongodb://54.153.62.38:27017/User');
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')
var bcrypt = require('bcrypt-nodejs')
var User = require('../objects/user')
var Agent = require('../objects/agent')

// Passport Serializer for session
passport.serializeUser(function(user, done) {
	done(null, user);
});

// Passport Deserializer for session
passport.deserializeUser(function(obj, done) {
	done(null, obj);
});

passport.use('user-login', new LocalStrategy({
	usernameField: 'email',
    passwordField: 'passwd',
	passReqToCallback : true
},
function(req, username, password, done) { 
    // check in mongo if a user with username exists or not
    var username_in_lower_case = username.toLowerCase()
    user_db.collection('account').find({username:username_in_lower_case}).toArray( 
    	function(err, result) {
        // In case of any error, return using the done method
        if (err)
        	return done(err);
        // Username does not exist, log error & redirect back
        if (!result[0]){
        	console.log('User Not Found with username '+ username_in_lower_case);
        	return done(null, false);                 
        }
        // User exists but wrong password, log the error 
        if (!bcrypt.compareSync(password, result[0].password)){
        	console.log('Invalid Password');
        	return done(null, false);
        }
        return done(null, result[0]);
    }
    );
}));

passport.use('user-signup', new LocalStrategy({
	usernameField: 'email',
    passwordField: 'passwd',
	passReqToCallback : true
},
function(req, username, password, done) {
      // find a user in Mongo with provided username
      var username_in_lower_case = username.toLowerCase();
      user_db.collection('account').find({username:username_in_lower_case}).toArray(
      	function(err, result) {
	        // In case of any error return
	        if (err){
	        	console.log('Error in SignUp: '+err);
	        	return done(err);
	        }
	        // already exists
	        if (result[0]) {
	        	console.log(result[0]);
	        	return done(null, false);
	        } else {
	          // if there is no user with that email
	          // create the user
	          var newUser = new User(username_in_lower_case, password);
	          user_db.collection('account').insert(newUser.account, function(err, result) {
	          	if (err){ 
	          		throw err; 
	          	}
	          	done(null, result[0]);
	          });
	      }
	  })
  }
  )
);


module.exports = passport;