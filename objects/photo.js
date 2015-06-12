var photo_db = require('mongoskin').db('mongodb://52.8.188.79:27017/Photo');

function Photo(key, uploader, recipient, timestamp) {
	this.key = key;
	this.uploader = uploader;
	this.recipient = recipient;
	this.timestamp = timestamp;
}

Photo.prototype.insert = function () {
	photo_db.collection('album').insert(this, function(err, result) {
	  	if (err){ 
	  		throw err; 
	  	}
	  	console.log(result[0])
	});
}

module.exports = Photo;