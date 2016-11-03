'use strict';

const commander = require('commander');
commander
  .option('-p, --port', '服务端口号，默认3000')
  .option('-r, --router', '路由文件，默认是当前命令行运行目录的router.js')
  .option('-c, --config', '配置文件，从当前运行目录，开始寻址，如果不设置，读取当前命令运行目录package.json的config 字段')
  .version('1.0.0')
  .usage('-command 参数');

commander.on('--help', function() {
  console.log('  Examples:');
  console.log('    $ node index.js -p 3000 -r router.js');
});

commander.on('--port', function() {
  console.log('xxxx');
});

commander.parse(process.argv);
