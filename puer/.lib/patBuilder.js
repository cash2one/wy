'use strict';
const toNunjucks = require('./toNunjucks');
const nunjucks = require('nunjucks');
const require1 = require('./requireOnce');
const config = require('../config.json');
const iconv = require('iconv-lite');
const path = require('path');
const fs = require('fs-extra');

const DIR = getRealPath(config.dir, process.cwd());
const DATA_DIR = getRealPath(config.data, process.cwd());
const PAT_DIR = getRealPath(config.pat, DIR);
const INCLUDE_DIR = getRealPath(config.include, DIR);
const CODE = config.code;

function getRealPath(cur, root) {
  return path.isAbsolute(cur) ? cur : path.join(root, cur);
}

const defaultOptions = {
  HTMLENCODE: function(str) {
    return str;
  },
  __include: function(file, data) {
    const dir = path.join(INCLUDE_DIR, file);
    if (fs.existsSync(dir)) {
      let html = iconv.decode(fs.readFileSync(dir), CODE);
      html = toNunjucks(html)
      try {
        return nunjucks.renderString(html, data || {});
      } catch (e) {
        console.error(e);
        console.log(file);
      }
    }
    return `<p>缺少文件 #${file}</p>`;
  }
};

module.exports = {
  build: function(name, res) {
    // 读取模板文件
    const file = path.join(PAT_DIR, `${name}.pat`);
    if (fs.existsSync(file)) {
      let html = iconv.decode(fs.readFileSync(file), CODE);
      html = toNunjucks(html);

      // 读取对应数据文件
      let data = {};
      const dataFile = path.join(DATA_DIR, `${name}.js`);
      if (fs.existsSync(dataFile)) {
        data = require1(dataFile)();
      }

      // 将数据绑定至模板
      data = Object.assign({}, defaultOptions, data || {});
      data.__ctx__ = data;
      const result = nunjucks.renderString(html, data);
      res.send(200, result);
    } else {
      res.send(404, `can not find ${name}`);
    }
  }
};