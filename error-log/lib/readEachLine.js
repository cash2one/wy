'use strict';
const fs = require('fs-extra');

module.exports = function(filePath, callback) {
  const content = fs.readFileSync(filePath).toString();
  const list = content.split(/\r?\n/g) || [];
  callback && list.forEach(callback);
  return list;
};