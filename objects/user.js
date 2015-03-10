var user_db = require('mongoskin').db('mongodb://52.11.66.117:27017/User');
var Account = require("./account")
var Profile = require('./profile')

function User(username, password) {
	this.account = new Account(username, password);
	this.profile = null;
}

// User.prototype.query_username = function() {
// 	user_db.collection('account').find({username:this.account.username}).toArray(
// 		function(err, result) {
// 			if (err)
//         		throw err;	        // Username does not exist, log error & redirect back
// 	        if (!result[0]){
// 	        	return false;                 
// 	        }else{
// 	        	this.account.username=result[0].username
// 	        	this.account.password=result[0].password
// 	        	return true
// 	        }
// 		}
// 	);
// };

module.exports = User;