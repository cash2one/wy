'use strict';

module.exports = function(done, req, res, next) {
  // 调用了 next，代表这次不处理
  // next();
  done({
    title: 'index2',
    ResUrl: '/cbg',
    content: '默认读取 test/index.js，来渲染模板3'
  });
};
