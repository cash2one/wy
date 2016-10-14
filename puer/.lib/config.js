'use strict';

const pkg = require('../package.json');
const path = require('path');
const util = require('./common/util');
const config = require(path.join(__dirname, '../', pkg.config));

// 模板根目录
const DIR = getRealPath(config.dir, process.cwd())[0];
// 数据文件目录
const DATA_DIR = getRealPath(config.data, process.cwd())[0];
// 模板文件目录
const PAT_DIR = getRealPath(config.pat, DIR);
// 静态文件目录
const STATIC_DIR =  getRealPath(config.static, DIR);
// 需要监听的静态目录
const WATCH_STATIC_DIRS = generaWatchPaths([STATIC_DIR]);
// 模板 include 方法对应的目录
const INCLUDE_DIR = getRealPath(config.include, DIR);
// 临时编译目录
const TMP_DIR = path.join(process.cwd(), '__tmp_' + pkg.config.split(/\/+|\\+|\./).slice(-3, -1).join('_'));
// 临时编译目录，静态文件放置路径
const TMP_STATIC_DIR = path.join(TMP_DIR, '__static__');
// 模板、脚本、样式在编译前的编码
const CODE = config.code;
// 静态文件端口号
const STATIC_PORT = 3000;
// 需要监听的全部的目录
const ALL_PATHS = generaWatchPaths([DATA_DIR, PAT_DIR, STATIC_DIR, INCLUDE_DIR]);

function getRealPath(dirs, root) {
  if (Array.isArray(dirs)) {
    let result = [];
    for (let i = 0, max = dirs.length; i < max; i++) {
      let dir = dirs[i];
      result.push(util.isHttpURI(dir) ? dir : path.join(root, dir));
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
      !util.isHttpURI(dir) && res.push(dir);
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
  DIR, DATA_DIR, PAT_DIR, STATIC_DIR, WATCH_STATIC_DIRS, INCLUDE_DIR, CODE, STATIC_PORT, TMP_DIR, ALL_PATHS
};
