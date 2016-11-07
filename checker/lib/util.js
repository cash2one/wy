'use strict';
const fs = require('fs');
const path = require('path');

module.exports = {
  readDirFiles (dir) {
    dir = path.resolve(process.cwd(), dir);

    // console.log(dir);
    const ctx = this;
    const dirs = fs.readdirSync(dir);
    const result = [];
    const childDirs = [];

    dirs.forEach(function(d) {
      let filepath = path.resolve(dir, d);

      if (ctx.isDir(filepath)) {
        childDirs.push(filepath);
      } else {
        result.push(filepath);
      }
    }.bind(ctx));

    if (childDirs.length > 0) {
      childDirs.forEach(cdir => {
        let childs = ctx.readDirFiles(cdir);
        result.push.apply(result, childs);
      });
    }

    return result;
  },
  isExists (filepath) {
    return fs.existsSync(filepath);
  },
  isDir (dir) {
    if (this.isExists(dir)) {
      let stat = fs.statSync(dir);
      return stat.isDirectory();
    }
    return false;
  },
  error (obj) {
    return Object.assign({
      line: -1,
      message: '',
      error: '',
      file: ''
    }, obj || {});
  },
  lineno (str) {
    return ((str || '').match(/(\n\r|\r\n|\n|\r)/g) || []).length + 1;
  },

  // 递归列表
  recurList (list, options) {
    list = list.slice(0);
    options = Object.assign({
      next (item, doNext) {
        doNext();
      },
      callback () {
        // 最终做什么?
      }
    }, options || {});

    let next = function(item) {
      if (item) {
        options.next(item, next.bind(list, list.shift()));
      } else {
        options.callback.call(list);
      }
    };
    next(list.shift());
  }
};
