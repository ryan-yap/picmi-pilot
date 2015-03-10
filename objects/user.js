var user_db = require('mongoskin').db('mongodb://52.11.66.117:27017/User');
var bcrypt = require('bcrypt-nodejs')

function User() {
	this.username = "";
	this.password = "";
}