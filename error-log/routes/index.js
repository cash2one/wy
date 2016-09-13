const express = require('express');
const router = express.Router();
const sourceOperator = require('../lib/operator');

/* GET home page. */
router.get('/', function(req, res, next) {
  const base = sourceOperator.queryLogsBaseInfo();
  const list = Object.keys(base).map(key => {
    return base[key];
  });
  list.sort((a, b) => {
    return a.length >= b.length ? -1 : 1;
  });
  res.render('index', { 
    title: '错误日志整理',
    list: list
  });
});

module.exports = router;
