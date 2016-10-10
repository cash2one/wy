'use strict';
const toNunjucks = require('./toNunjucks');
const nunjucks = require('nunjucks');
const path = require('path');
const util = require('./util');
const fs = require('fs-extra');

const template = new nunjucks.Environment({
  tags: {
    blockStart: '{#',
    blockEnd: '#}',
    variableStart: '{{',
    variableEnd: '}}',
    commentStart: '{@',
    commentEnd: '@}'
  }
});

const config = require('./config');
const DIR = config.DIR,
  DATA_DIR = config.DATA_DIR,
  PAT_DIR = config.PAT_DIR,
  INCLUDE_DIR = config.INCLUDE_DIR,
  CODE = config.CODE;


const defaultOptions = {
  HTMLENCODE: function(str) {
    return str;
  },
  __include: function(file, data) {
    const filePath = util.isFileExistAndGetName(INCLUDE_DIR, file);
    if (filePath) {
      let html = util.readFile(filePath, CODE);
      html = toNunjucks(html);
      try {
        return template.renderString(html, data || {});
      } catch (e) {
        console.error(e);
        console.log(file);
        console.log(html);
      }
    }
    return `<p>缺少文件 #${file}</p>`;
  },
  __comments: function(key) {
    return `<!--${key}-->`;
  }
};

module.exports = {
  build: function(name, res) {
    // 读取模板文件
    const filePath = util.isFileExistAndGetName(PAT_DIR, `${name}.pat`);
    if (filePath) {
      let html = util.readFile(filePath, CODE);
      html = toNunjucks(html);
      let data = util.readMock(path.join(DATA_DIR, `${name}.js`));
      data = Object.assign({}, defaultOptions, data || {});
      data.__ctx__ = data;

      try {
        const result = template.renderString(html, data);
        res.set('content-type', 'text/html');
        res.send(result);
      } catch (e) {
        console.error(e);
        res.send(500, html);
      }
    } else {
      res.send(404, `can not find ${name}`);
    }
  }
};
