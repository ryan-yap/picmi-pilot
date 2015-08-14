function Profile(firstname, lastname, email, mobile_number) {
	this.firstname = firstname;
	this.lastname = lastname;
	this.email = email.toLowerCase();
	this.mobile_number = mobile_number;
	this._id = null;
	this.profile_pic = null;
}

Profile.prototype.insert = function (id , db) {
	this._id = id;
	db.collection('profile').insert(this, function(err, result) {
	  	if (err){ 
	  		throw err; 
	  	}
	  	console.log(result[0])
	});
}

module.exports = Profile;