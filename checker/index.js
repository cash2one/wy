'use strict';
const fs = require('fs-extra');
const cwd = process.cwd();
const path = require('path');
const colors = require('colors');
const util = require('./lib/util');
const commander = require('commander');

// 生成命令行
commander
  .version('0.0.1')
  .option('-f, --file [f]', '检测地址', cwd)
  .option('-s, --save [n]', '保存日志', val => val ? val : true);
commander.parse(process.argv);

// 检查这个目录
const files = util.readDirFiles(path.resolve(cwd, commander.file));
// 获取所有检查器
const checkers = util.readDirFiles(path.resolve(__dirname, './checker')).map(file => {
  return require(file);
});

function runCheckers (file, callback) {
  let content = fs.readFileSync(file).toString();
  let extname = path.extname(file).slice(1).toLowerCase();
  let errorsAll = [];

  util.recurList(checkers, {
    next (checker, doNext) {
      if (checker && checker.type && checker.type.match(new RegExp(`\\b${extname}\\b`))) {
        let fn = checker.fn.bind(checker);
        fn(file, content, errors => {
          if (errors) {
            errorsAll.push.apply(errorsAll, Array.isArray(errors) ? errors : [errors]);
          }
          doNext();
        });
      } else {
        doNext();
      }
    },
    callback () {
      // 错误是倒序返回的
      callback && callback(errorsAll);
    }
  });
}

function printAllErrors(errors) {
  errors.forEach((obj, index) => {
    if (index) {
      console.log('**  -----------------------  **');
    }
    console.log('  地址: ' + obj.file.green);
    console.log('  行号: ' + obj.line.toString().green);
    console.log('  错误: ' + obj.error.red);
    console.log('  消息: ' + obj.message.red);
  });
}

// 遍历所有文件
const allErrors = [];
util.recurList(files, {
  next (file, doNext) {
    runCheckers(file, function (errors) {
      console.log(`********** 检查地址: ${file}`);
      printAllErrors(errors || []);
      console.log(`********** 结束检查地址: ${file}`);
      console.log('\n\n');

      if (commander.save) {
        allErrors.push.apply(allErrors, errors || []);
      }

      doNext();
    });
  },
  callback () {
    console.log('检查完毕....');

    if (commander.save) {
      let file = path.resolve(cwd, typeof commander.save === 'string' ? commander.save : './_lfp_log.txt');
      fs.ensureFileSync(file);
      fs.writeFileSync(file, JSON.stringify(allErrors, null, 2));
    }
  }
});
