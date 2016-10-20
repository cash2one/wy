'use strict';
// 如果以后，需要跨目录编译，
// 建议监听需要跨越的目录，然后，把所有目录，复制到当前界面的 __template 目录，然后再进行编译~~~

const path = require('path');
const util = require('./common/util');
const fs = require('fs-extra');
const exec = require('child_process').exec;

const config = require('./config');
const DIR = config.DIR,
  DATA_DIR = config.DATA_DIR,
  TEMPLATE_SOURCE_DIRS = config.TEMPLATE_SOURCE_DIRS,
  CODE = config.CODE;

// python 的中间目录，以及中间的保存目录
const dirMiddle = path.join(__dirname, '../.python/');
const dirMiddleSave = path.join(process.cwd(), './.python/', 'run.py');
fs.ensureFileSync(dirMiddleSave);
// python 编译的模板文件
const pythonTemplate = fs.readFileSync(path.join(dirMiddle, './_run.py')).toString();
const contentOther = (config.pythonOthers || []).map(dir => {
  let filepath = path.resolve(process.cwd(), './' + dir);
  if (fs.existsSync(filepath)) {
    return fs.readFileSync(filepath).toString();
  }
  return '';
}).join('\n');

// 生成临时文件，并且运行
function buildPythonFileAndRun(nameTemplate, paths, data, callback) {
  let options = {
    paths, data, contentOther, nameTemplate
  };
  let content = pythonTemplate.replace(/\${([^}]+)}/g, (str, key) => {
    return options[key] || '';
  });

  fs.writeFileSync(dirMiddleSave, content);

  callback = callback || function(er, str) { console.log(str) };
  exec(`python ${dirMiddleSave}`, (error, stdout, stderr) => {
    if (error) {
      callback(error, stderr);
      return;
    }
    callback(error, stdout.replace(/(START)(=+)(@+)\2\1([\s\S]*)(END)\2\3\2\5/g, '$4'));
  });
}

module.exports = {
  build(name, res) {
    // 读取模板文件
    const filePath = util.isFileExistAndGetName(TEMPLATE_SOURCE_DIRS, `${name}`);
    if (filePath) {
      let data = util.readMock(path.join(DATA_DIR, path.basename(name, path.extname(name)) + '.js'));
      data = Object.assign({}, data || {});

      buildPythonFileAndRun(name, JSON.stringify(TEMPLATE_SOURCE_DIRS), JSON.stringify(data), function(error, content) {
        if (error) {
          res.set('content-type', 'text/html');
          res.status(500).send(`<html><head></head><body><pre>${content}</pre></body></html>`);
        } else {
          res.send(content);
        }
      });
    } else {
      res.send(404, `can not find ${name}`);
    }
  },
};
