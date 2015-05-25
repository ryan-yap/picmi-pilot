var report_db = require('mongoskin').db('mongodb://54.153.62.38:27017/Report');

function Report(user_id, message, category) {
	this.user_id = user_id;
	this.message = message;
	this.category = category
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