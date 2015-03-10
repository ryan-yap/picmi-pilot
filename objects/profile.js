var user_db = require('mongoskin').db('mongodb://52.11.66.117:27017/User');

function Profile(firstname, lastname, email, mobile_number) {
	this.firstname = firstname;
	this.lastname = lastname;
	this.email = email;
	this.mobile_number = mobile_number;
	this._id = null;
}

Profile.prototype.insert = function (id) {
	this._id = id;
	user_db.collection('profile').insert(this, function(err, result) {
	  	if (err){ 
	  		throw err; 
	  	}
	  	console.log(result[0])
	});
}

module.exports = Profile;