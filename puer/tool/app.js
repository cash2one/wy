'use strict';
const express = require('express');
const colors = require('colors');
const reload = require('reload');
const path = require('path');
const app = express();
const fs = require('fs');

const favicon = require('serve-favicon');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const config = require('../.lib/config');
const util = require('../.lib/common/util');

app.get('')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/', express.static(path.join(__dirname, './')));
app.all('*', (req, res, next) => {
  res.set('Access-Control-Allow-Origin', '*');
  next();
});

function readFile(filename) {
  const filePath = util.isFileExistAndGetName(config.PAT_DIR, filename);
  if (!filePath) {
    return '';
  }
  let content = util.readFile(filePath, config.CODE);

  // 替换掉 include 的内容
  while (/<!--#CGIEXT#\s+expand\s+['"]?(.*?)['"]?\s*-->/.test(content)) {
    content = content.replace(/<!--#CGIEXT#\s+expand\s+['"]?(.*?)['"]?\s*-->/gm, function(str, pathInclude) {
      pathInclude = util.isFileExistAndGetName(config.INCLUDE_DIR, pathInclude);
      console.log(pathInclude);

      if (pathInclude) {
        return util.readFile(pathInclude, config.CODE);
      }

      return `<!--#CGIEXT# const ${pathInclude}="@@IS_EMPTY@@" -->`;
    });
  }

  return content;
}

app.get('/pat/content', (req, res, next) => {
  const filename = req.query.filename;
  console.log(`get pat content: ${filename}`);

  let result = '';
  if (filename) {
    result = readFile(filename);
  }
  res.send(result);
});

app.post('/pat/data/save', (req, res, next) => {
  next();
});

app.use((req, res, next) => {
  res.send(404, 'can not find anything');
});

const server = app.listen(5000, () => {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Example app listening at port:%s'.bold.green, port);
});
