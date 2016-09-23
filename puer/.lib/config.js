'use strict';

const pkg = require('../package.json');
const path = require('path');
const config = require(path.join(process.cwd(), pkg.config));

const DIR = getRealPath(config.dir, process.cwd());
const DATA_DIR = getRealPath(config.data, process.cwd());
const PAT_DIR = getRealPath(config.pat, DIR);
const STATIC_DIR =  getRealPath(config.static, DIR);
const INCLUDE_DIR = getRealPath(config.include, DIR);
const CODE = config.code;
const STATIC_PORT = config.staticPort;


function getRealPath(dirs, root) {
  if (Array.isArray(dirs)) {
    let result = [];
    for (let i = 0, max = dirs.length; i < max; i++) {
      let dir = dirs[i];
      result.push(/^http/.test(dir) ? dir : path.join(root, dir));
    }
    return result;
  }
  return path.isAbsolute(dirs) ? dirs : path.join(root, dirs);
}

module.exports = {
  DIR, DATA_DIR, PAT_DIR, STATIC_DIR, INCLUDE_DIR, CODE, STATIC_PORT
};