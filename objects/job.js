var job_db = require('mongoskin').db('mongodb://52.8.188.79:27017/Job');

function Job(distance, location_name, message, objecttype, longitude, latitude, jobID, requester_id, driver_id, requester_username, driver_name) {
	this.distance = distance
	this.location_name = location_name
	this.message = message
	this.objecttype = objecttype 
	this.longitude = longitude
	this.latitude = latitude 
	this.jobID = jobID
	this.requester_id = requester_id
	this.driver_id = driver_id
	this.requester_username = requester_username
	this.driver_name = driver_name
	this.isResponded = false
}

Job.prototype.insert = function () {
	job_db.collection('jobs').insert(this, function(err, result) {
	  	if (err){ 
	  		throw err; 
	  	}
	  	console.log(result[0])
	});
}

module.exports = Job;