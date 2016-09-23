'use strict';

const fs = require('fs');
const path = require('path');
const iconv = require('iconv-lite');
const require1 = require('./requireOnce');

module.exports = {
  isFileExistAndGetName: function(dirs, filename) {
    if (typeof dirs === 'string') {
      dirs = [dirs];
    }

    let result = null;

    for (let i = 0, max = dirs.length; i < max; i++) {
      let dir = dirs[i];
      let filePath = path.join(dir, filename);
      if (/^http/.test(filePath) || fs.existsSync(filePath)) {
        result = filePath;
        break;
      }
    }

    return result;
  },
  readFile: function(filePath, code) {
    return this.decode(fs.readFileSync(filePath), code);
  },
  readMock: function(filePath, defaultData) {
    if (!fs.existsSync(filePath)) {
      return defaultData || {};
    }
    let fn = require1(filePath);
    return typeof fn === 'function' ? fn() : fn;
  },
  decode: function(bytes, code) {
    return iconv.decode(bytes, code);
  }
};