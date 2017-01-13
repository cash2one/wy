'use strict';
const Thenable = require('thenablejs');
const xlsxj = require('xlsx-to-json');

exports.read = function(options) {
  const thenable = new Thenable();

  xlsxj(options || {
    input: 'source.xlsx',
    output: 'output.json',
    sheet: 'Sheet1'
  }, function(err, result) {
    if (err) {
      console.error(err);
    } else {
      thenable.resolve(result);
    }
  });

  return thenable;
};

exports.save = function(filename, data) {
  const fs = require('fs');
  let content = JSON.stringify(data);
  if (Array.isArray(data)) {
    content = JSON.stringify(data, ' ', 2)
      .replace(/\[[^\[\]]+\]/g, function(str) {
        return str.replace(/\s*\n\s*/g, '');
      });
  }
  fs.writeFileSync(filename, content);
};
