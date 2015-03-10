var user_db = require('mongoskin').db('mongodb://52.11.66.117:27017/User');

function User_Payment(card_number, cvv, exp_date, postal_code) {
	this.card_number = card_number;
	this.cvv = cvv;
	this.exp_date = exp_date;
	this.postal_code = postal_code;
	this._id = null;
}

User_Payment.prototype.insert = function (id) {
	this._id = id;
	user_db.collection('payment').insert(this, function(err, result) {
	  	if (err){ 
	  		throw err; 
	  	}
	  	console.log(result[0])
	});
}

module.exports = User_Payment;