'use strict';
const absURL = 'http://res.dtws2.cbg.163.com/images/role/equips/big/';

const fs = require('fs');
const co = require('co');
const path = require('path');
const request = require('request');

let dir = __dirname;
let list = fs.readdirSync(path.join(dir, './images'));
let errorResult = [];

function* checkName(name) {
  let url = absURL + name;
  console.log(`检查: ${name} - ${url}`);
  return new Promise(function(resolve) {
    request.get(url, function(err, res, body) {
      const code = res.statusCode;
      console.log(code);
      if (err || code == 200) {
        errorResult.push({name, url, code});
      }
      resolve();
    });
  });
}

co(function*() {
  let name = list.shift();
  while (name) {
    yield checkName(name);
    name = list.shift();
  }
}).then(function() {
  console.log(`检查完毕，重复数量: ${errorResult.length}`);
  fs.writeFileSync('./error.txt', JSON.stringify(errorResult, null, 2), {encoding: 'utf8'});
});
