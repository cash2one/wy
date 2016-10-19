'use strict';

const exec = require('child_process').exec;
const arg1 = 'hello', arg2 = 'python';

exec('python test.py ' + arg1 + ' ' + arg2, function(error, stdout, stderr) {
  if (error) {
    console.log('产生了错误:' + stderr);
    return;
  }
  console.log('输出内容:');
  console.log(stdout);
  console.log(typeof stdout);
});
