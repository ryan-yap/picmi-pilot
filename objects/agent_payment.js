var agent_db = require('mongoskin').db('mongodb://52.11.66.117:27017/Agent');

function Agent_Payment(payment_method) {
	this.payment_method = payment_method;
}

Agent_Payment.prototype.insert = function (id) {
	this._id = id;
	agent_db.collection('payment').insert(this, function(err, result) {
	  	if (err){ 
	  		throw err; 
	  	}
	  	console.log(result[0])
	});
}

module.exports = Agent_Payment;