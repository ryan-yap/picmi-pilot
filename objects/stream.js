var stream_db = require('mongoskin').db('mongodb://52.8.188.79:27017/Stream');

function Stream(user_id, driver_id, session_id, token) {
	this.user_id = user_id;
	this.driver_id = driver_id;
	this.session_id = session_id;
	this.token = token;
}

Stream.prototype.insert = function () {
	stream_db.collection('session').insert(this, function(err, result) {
	  	if (err){ 
	  		throw err; 
	  	}
	  	console.log(result[0])
	});
}

module.exports = Stream;