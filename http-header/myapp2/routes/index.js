'use strict';

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  // res.render('index', { title: 'Express' });
  let xRequestedBy = req.get('X-Requested-By');
  res.set('Access-Control-Allow-Origin', '*');
  res.send(`自定义头部 X-Requested-By: ${xRequestedBy}`);
});

router.post('/xxx', function(req, res, next) {
  res.send('哈哈哈啊:' + JSON.stringify(req.cookies));
});

module.exports = router;
