var agent_db = require('mongoskin').db('mongodb://54.153.62.38:27017/Agent');
var Account = require("./account")
var Profile = require('./profile')

function Agent(username, password) {
	this.account = new Account(username, password);
	this.profile = null;
	this.payment_method = null;
}

Agent.prototype.insert_profile = function(id) {
	this.profile.insert(id,agent_db);
};

module.exports = Agent;