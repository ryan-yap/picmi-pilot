var report_db = require('mongoskin').db('mongodb://52.8.188.79:27017/Report');

function Report(user_id, message, category, rate) {
	this.user_id = user_id;
	this.message = message;
	this.category = category;
	this.rate = rate;
}

Report.prototype.insert = function () {
	report_db.collection('bugs').save(this, function(err, result) {
	  	if (err){ 
	  		throw err; 
	  	}
	  	console.log(result[0])
	});
}

module.exports = Report;