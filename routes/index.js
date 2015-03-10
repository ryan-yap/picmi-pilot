var express = require('express');
var router = express.Router();

//=============Index Page Handing Module===============

//HTTP 1.1 GET Request Handler
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
