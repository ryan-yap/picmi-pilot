var user_db = require('mongoskin').db('mongodb://52.8.188.79:27017/User');

function Banking(payment_method) {
	this.payment_method = payment_method;
}

Banking.prototype.insert = function (id) {
	this._id = id;
	user_db.collection('banking').insert(this, function(err, result) {
	  	if (err){ 
	  		throw err; 
	  	}
	  	console.log(result[0])
	});
}

module.exports = Banking;