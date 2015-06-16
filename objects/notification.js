var noti_db = require('mongoskin').db('mongodb://54.153.62.38:27017/Notification');

function Notification(noti_type, recipient_id, obj, notified) {
	this.noti_type = noti_type;
	this.recipient_id = recipient_id;
	this.obj = obj;
	this.notified = notified
}

Notification.prototype.insert = function (callback) {
	noti_db.collection('notification').insert(this, function(err, result) {
	  	if (err){ 
	  		throw err; 
	  	}
	  	callback(result[0])
	});
}

module.exports = Notification;