'use strict';

const pkg = require('../package.json');
const path = require('path');
const config = require(path.join(process.cwd(), pkg.config));

const DIR = getRealPath(config.dir, process.cwd());
const DATA_DIR = getRealPath(config.data, process.cwd());
const PAT_DIR = getRealPath(config.pat, DIR);
const STATIC_DIR =  getRealPath(config.static, DIR);
const STATIC_BACKUP =  getRealPath(config.staticBackup, DIR);
const INCLUDE_DIR = getRealPath(config.include, DIR);
const CODE = config.code;
const STATIC_PORT = config.staticPort;


function getRealPath(cur, root) {
  return path.isAbsolute(cur) ? cur : path.join(root, cur);
}

module.exports = {
  DIR, DATA_DIR, PAT_DIR, STATIC_DIR, INCLUDE_DIR, STATIC_BACKUP, CODE, STATIC_PORT
};