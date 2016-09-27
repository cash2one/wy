'use strict';

const pkg = require('../package.json');
const path = require('path');
const config = require(path.join(process.cwd(), pkg.config));

const DIR = getRealPath(config.dir, process.cwd())[0];
const DATA_DIR = getRealPath(config.data, process.cwd())[0];
const PAT_DIR = getRealPath(config.pat, DIR);
const STATIC_DIR =  getRealPath(config.static, DIR);
const INCLUDE_DIR = getRealPath(config.include, DIR);
const CODE = config.code;
const STATIC_PORT = config.staticPort || 3000;
// 文件的目录列表
const ALL_PATHS = generaWatchPaths([DATA_DIR, PAT_DIR, STATIC_DIR, INCLUDE_DIR]);

function getRealPath(dirs, root) {
  if (Array.isArray(dirs)) {
    let result = [];
    for (let i = 0, max = dirs.length; i < max; i++) {
      let dir = dirs[i];
      result.push(/^http/.test(dir) ? dir : path.join(root, dir));
    }
    return result;
  }
  return [path.isAbsolute(dirs) ? dirs : path.join(root, dirs)];
}

function generaWatchPaths(list) {
  let dirs = list.reduce((res, arr) => {
    if (typeof arr === 'string') {
      arr = [arr];
    }
    arr.forEach(dir => {
      !/^http/.test(dir) && res.push(dir);
    });
    return res;
  }, []).sort();

  // dirs => [ 'a/b', 'a/b/c', 'x/', 'x/y/z' ]
  let result = [];
  let prev = dirs[0], next;
  for (var i = 1, max = dirs.length; i < max; i++) {
    next = dirs[i];
    if (next.startsWith(prev)) {
      // continue;
    } else {
      result.push(prev);
      prev = next;
    }
  }
  if (prev) {
    result.push(prev);
  }

  return result;
}

module.exports = {
  DIR, DATA_DIR, PAT_DIR, STATIC_DIR, INCLUDE_DIR, CODE, STATIC_PORT, ALL_PATHS
};
