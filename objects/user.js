var user_db = require('mongoskin').db('mongodb://52.8.188.79:27017/User');
var Account = require("./account")
var Profile = require('./profile')

function User(username, password) {
	this.account = new Account(username, password);
	this._id = null;
	this.profile = null;
	this.payment = null;
	this.banking = null;
	this.device_token = null;
}

User.prototype.insert_profile = function(id) {
	this.profile.insert(id,user_db);
};

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