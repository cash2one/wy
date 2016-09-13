'use strict';
// 对错误日志，进行划分，加工
const fs = require('fs-extra');
const path = require('path');
const readEachLine = require('./readEachLine');
const md5 = require('./md5');
const pkg = require('../package.json');

let logDir = pkg.logDir;
let sourceFile = pkg.sourceFile;
sourceFile = path.isAbsolute(sourceFile) ? sourceFile : path.join(process.cwd(), sourceFile);
logDir = path.isAbsolute(logDir) ? logDir : path.join(process.cwd(), logDir);

// 将错误文件，切分为小文件
exports.splitIntoFiles = function() {
  fs.removeSync(logDir);

  readEachLine(filePath, line => {
    if (!line.trim()) {
      return;
    }
    try {
      const data = JSON.parse(line);
      const message = data.msg || '';
      const key = md5(message);

      const fileName = path.join(logDir, key);
      fs.ensureFileSync(fileName);
      fs.appendFileSync(fileName, JSON.stringify(data) + '\n');
    } catch (e) {
      console.error(e);
    }
  });
};

// 读取错误文件的基本信息
exports.queryLogsBaseInfo = function(callback) {
  const map = {};
  const files = fs.readdirSync(logDir);
  files.forEach(filePath => {
    const item = map[filePath] = {};
    let counter = 0;

    readEachLine(path.join(logDir, filePath), line => {
      if (!line.trim()) {
        return;
      }
      if (counter <= 0) {
        try {
          console.log(line);
          const data = JSON.parse(line);
          item.message = data.msg;
        } catch (e) {
          console.error(e);
        }
      }
      counter++;
    });
    
    item.length = counter;
  });

  return map;
};

