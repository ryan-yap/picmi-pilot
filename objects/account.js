var bcrypt = require('bcrypt-nodejs')

function Account(username, password) {
	this.username = username;
	this.password = bcrypt.hashSync(password);
}

module.exports = Account;