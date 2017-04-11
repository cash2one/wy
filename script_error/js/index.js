'use strict';
finish('/index.js');
var Index = {
  log: function(msg) {
    console.log(msg);
  },
  err: function() {
    var x = y;
  }
};

// 除了 IE 可以获取到当前运行中的 script 标签
// console.log(document.currentScript);
