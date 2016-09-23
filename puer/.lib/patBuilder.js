'use strict';
const toNunjucks = require('./toNunjucks');
const nunjucks = require('nunjucks');
const require1 = require('./requireOnce');
const iconv = require('iconv-lite');
const path = require('path');
const fs = require('fs-extra');
const co = require('co');

nunjucks.configure({
  tags: {
    blockStart: '{#',
    blockEnd: '#}',
    variableStart: '{{',
    variableEnd: '}}',
    commentStart: '{!',
    commentEnd: '!}'
  }
});

const config = require('./config');
const DIR = config.DIR, 
  DATA_DIR = config.DATA_DIR, 
  PAT_DIR = config.PAT_DIR, 
  INCLUDE_DIR = config.INCLUDE_DIR, 
  CODE = config.CODE;

function isGenerator(obj) {
  return 'function' == typeof obj.next && 'function' == typeof obj.throw;
}

function isGeneratorFunction(obj) {
  var constructor = obj.constructor;
  if (!constructor) return false;
  if ('GeneratorFunction' === constructor.name || 'GeneratorFunction' === constructor.displayName) return true;
  return isGenerator(constructor.prototype);
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
    const file = path.join(PAT_DIR, `${name}.pat`);
    if (fs.existsSync(file)) {
      let html = iconv.decode(fs.readFileSync(file), CODE);
      html = toNunjucks(html);

      // 读取对应数据文件
      let data = {};
      const dataFile = path.join(DATA_DIR, `${name}.js`);
      if (fs.existsSync(dataFile)) {
        let fn = require1(dataFile);
        if (isGeneratorFunction(fn)) {
          co(fn)
            .then(
              bindToTemplate,
              function(err) {
                res.send(500, err);
              }
            );
        } else {
          if (typeof fn === 'function') {
            data = fn();
          } else {
            data = fn;
          }
          bindToTemplate();
        }
      } else {
        bindToTemplate();
      }

      function bindToTemplate() {
        // 将数据绑定至模板
        data = Object.assign({}, defaultOptions, data || {});
        data.__ctx__ = data;
        try {
          const result = nunjucks.renderString(html, data);
          res.send(200, result);
        } catch (e) {
          console.error(e);
          res.send(500, html);
        }
      }      
    } else {
      res.send(404, `can not find ${name}`);
    }
  }
};