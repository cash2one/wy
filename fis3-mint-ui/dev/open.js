'use strict';
require('colors');
const os = require('os');
const fs = require('fs');
const path = require('path');

function openBrowser (url, callback) {
  var map, opener;
  map = {
    'darwin': 'open',
    'win32': 'start '
  };
  opener = map[process.platform] || 'xdg-open';
  return require("child_process").exec(opener + ' ' + url, callback || function() {});
}

function getIps () {
  const ifaces = os.networkInterfaces();
  const ips = [];
  Object.keys(ifaces).forEach(key => {
    ifaces[key].forEach(details => {
      if (details.family === 'IPv4') {
        ips.push(details.address);
      }
    });
  });
  return ips;
}

let product = process.argv[2];
console.log(`try to open: ${product}`.green.bold);

let config = {}, configFilepath = path.join(__dirname, './' + product + '/config.js');
if (fs.existsSync(configFilepath)) {
  config = Object.assign({ }, require(configFilepath));
}

if (config.port) {
  openBrowser(`http://localhost:${config.port}/`, function() {
    let ips = getIps();
    let address = '';
    ips.forEach(ip => {
      address += '  http://' + ip + `:${config.port}/\n`;
    });
    console.log(`you can visit by these address:\n${address}`.green);
  });
} else {
  console.log(`config.js for "${product}" is not exists!!`.red.bold);
}
