'use strict';
const express = require('express');
const colors = require('colors');
const reload = require('reload');
const path = require('path');
const app = express();
const fs = require('fs-extra');

const favicon = require('serve-favicon');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const config = require('../.lib/config');
const util = require('../.lib/common/util');
const pkg = require('../package.json');

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ extended: false, limit: '50mb' }));
app.use(cookieParser());
app.use('/', express.static(path.join(__dirname, './')));
app.all('*', (req, res, next) => {
  res.set('Access-Control-Allow-Origin', '*');
  next();
});

function readFile(dirpath, filename) {
  const templateDirs = dirpath ? [dirpath] : config.TEMPLATE_SOURCE_DIRS;
  const filePath = util.isFileExistAndGetName(templateDirs, filename);
  console.log(filePath)
  if (!filePath) {
    return '';
  }
  let content = util.readFile(filePath, config.CODE);

  // 替换掉 include 的内容
  while (/<!--#CGIEXT#\s+expand\s+['"]?(.*?)['"]?\s*-->/.test(content)) {
    content = content.replace(/<!--#CGIEXT#\s+expand\s+['"]?(.*?)['"]?\s*-->/gm, function(str, pathInclude) {
      var newPathInclude = util.isFileExistAndGetName(templateDirs, pathInclude);
      if (newPathInclude) {
        return util.readFile(newPathInclude, 'gbk');
      }

      return `<!--#CGIEXT# const ${pathInclude}="@@IS_EMPTY@@" -->`;
    });
  }

  return content;
}

app.get('/pat/content', (req, res, next) => {
  const filename = req.query.filename;
  const dirpath = req.query.dirpath;
  console.log(`get pat content: ${path.join(dirpath, filename)}`);

  let result = '';
  if (filename) {
    result = readFile(dirpath, filename);
  }
  res.send(result);
});

app.post('/pat/data/save', (req, res, next) => {
  const filename = req.body.filename,
    content = req.body.content;

  const savePath = path.join(__dirname, '../data/', path.basename(pkg.config, '.json'), filename);
  fs.ensureFileSync(savePath);
  fs.writeFileSync(savePath, `
'use strict';
const combine = require('../../.lib/combine');
module.exports = function getData() {
  return combine([
    ${content},
    './com/com'
  ], __dirname);
};
  `);

  res.send('suc');
});

app.get('/pat/data/default', (req, res, next) => {
  let defaultData = '{}';
  const filePath = path.join(__dirname, './default', path.basename(pkg.config));
  if (fs.existsSync(filePath)) {
    defaultData = fs.readFileSync(filePath).toString();
  }
  res.send(defaultData);
});

app.use((req, res, next) => {
  res.send(404, 'can not find anything');
});

const server = app.listen(5000, () => {
  var host = server.address().address;
  var port = server.address().port;
  console.log(pkg.config.bold.green);
  console.log('Example app listening at port:%s'.bold.green, port);
});
