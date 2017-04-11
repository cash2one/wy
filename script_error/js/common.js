'use strict';
try {
finish('/common.js');
var Common = {
  say: function() {
    console.log('common');
  },
  err: function() {
    var m = n;
  }
};

// 除了 IE 可以获取到当前运行中的 script 标签
// console.log(document.currentScript);

} catch (e) {
  console.log(e);
  throw e;
}
