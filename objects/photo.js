var photo_db = require('mongoskin').db('mongodb://54.153.62.38:27017/Photo');

function Photo(files, uploader, recipient, timestamp) {
	this.files = files;
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