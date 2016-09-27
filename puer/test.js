'use strict';
const config = require('./.lib/config');
const path = require('path');

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

console.log(
  generaWatchPaths([
    config.DATA_DIR, config.PAT_DIR, config.STATIC_DIR, config.INCLUDE_DIR
  ])
)

// console.log(
//   generaWatchPaths([
//     ['a/b/c', 'x/y/z'],
//     ['a/b'],
//     'x/'
//   ])
// );
