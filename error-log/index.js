'use strict';
const app = require('./app');
const sourceOperator = require('./lib/operator');

// 对错误进行划分
// sourceOperator.splitIntoFiles();
// 读取基本信息
// sourceOperator.queryLogsBaseInfo();


const server = app.listen(3000, function() {
  const address = server.address();
  console.log('listening port: 3000');
});