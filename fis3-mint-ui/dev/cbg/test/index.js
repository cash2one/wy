'use strict';

module.exports = function(done, req, res, next) {
  // 调用了 next，代表这次不处理
  // next();
  done({
    title: 'index2',
    ResUrl: '/static',
    content: '欢迎来到vue的界面'
  });
};
