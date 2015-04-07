var user_db = require('mongoskin').db('mongodb://54.153.62.38:27017/User');

function Device_Token(device_token) {
	this.token = device_token;
}

Device_Token.prototype.insert = function (id) {
	this._id = id;
	user_db.collection('device_token').save(this, function(err, result) {
	  	if (err){ 
	  		throw err; 
	  	}
	  	console.log(result[0])
	});
}

module.exports = Device_Token;