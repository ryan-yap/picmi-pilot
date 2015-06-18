var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
	res.send("Status: OK! | Node.js Server is running");
});

module.exports = router;