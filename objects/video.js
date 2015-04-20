var video_db = require('mongoskin').db('mongodb://54.153.62.38:27017/Video');

function Video(key, uploader, recipient, timestamp) {
	this.key = key;
	this.uploader = uploader;
	this.recipient = recipient;
	this.timestamp = timestamp;
}

Video.prototype.insert = function () {
	video_db.collection('album').insert(this, function(err, result) {
	  	if (err){ 
	  		throw err; 
	  	}
	  	console.log(result[0])
	});
}

module.exports = Video;