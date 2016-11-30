// router.js
'use strict';

const Mock = require('lfp-mock-web');
const nunjucksBuilder = Mock.nunjucksBuilder;
const staticResource = Mock.staticResource;

module.exports = {
  // 配置 get 请求，访问规则为: /pat/xxx.html
  'GET /:page.html' (req, res, next) {
    nunjucksBuilder.build(req.params.page + '.html', res, {
      // 默认数据
    });
  },
  // 配置 get 请求，访问规则为: /pat/xxx.html
  'GET /:dir/:page.html' (req, res, next) {
    nunjucksBuilder.build(req.params.dir + '/' + req.params.page + '.html', res, {
      // 默认数据
    });
  },
  // 配置静态资源访问规则
  'GET *.:ext' (req, res, next) {
    const ext = req.params.ext.toLowerCase();
    if (['js', 'css', 'png', 'jpg', 'jpeg', 'gif', 'bmp', 'txt', 'less', 'scss'].indexOf(ext) >= 0) {
      // 静态资源转发到本地临时目录
      staticResource.query(req, res, next);
    } else {
      // 继续运行之后的规则
      next();
    }
  }
};
