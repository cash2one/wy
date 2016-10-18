'use strict';

var express = require('express');
var router = express.Router();

/* GET users listing. */
router.all('/', function(req, res, next) {
  let xRequestedBy = req.get('X-Requested-By');
  res.set('Access-Control-Allow-Origin', '*');
  res.send(`自定义头部 X-Requested-By: ${xRequestedBy}`);
});

module.exports = router;
