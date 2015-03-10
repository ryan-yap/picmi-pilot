var agent_db = require('mongoskin').db('mongodb://52.11.66.117:27017/Agent');

function Agent(username, password) {
	this.username = username;
	this.password = password;
}

Agent.prototype.match_username = function() {
	agent_db.collection('account').find({username:this.username}).toArray(
		function(err, result) {
			if (err)
        		throw err;	        // Username does not exist, log error & redirect back
	        if (!result[0]){
	        	return null;                 
	        }else{
	        	return result[0]
	        }
		}
	);
};

module.exports = Agent;