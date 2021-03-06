'use strict';

const path = require('path');

Object.assign(exports, {
  target: './cbg',
  port: 7001
});

// fis 配置
exports.fis = (fis, product, isDevelop) => {
  console.log(`fis3 配置中，产品: ${product}  模式: ${isDevelop ? "develop" : "product"}`);
  fis.match(`/${product}/js/base.js`, {
    useHash: true
  });
};
