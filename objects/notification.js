var noti_db = require('mongoskin').db('mongodb://52.8.188.79:27017/Notification');

function Notification(noti_type, recipient_id, obj, notified) {
	this.noti_type = noti_type;
	this.recipient_id = recipient_id;
	this.obj = obj;
	this.notified = notified
}

Notification.prototype.insert = function () {
	noti_db.collection('notification').insert(this, function(err, result) {
	  	if (err){ 
	  		throw err; 
	  	}
	  	console.log(result[0])
	});
}

module.exports = Notification;