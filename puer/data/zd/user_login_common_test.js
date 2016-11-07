'use strict';
const require1 = require('../../.lib/require1');
module.exports = function getData() {
  return Object.assign(
    {
      // 页面 tdk
      "keywords": "藏宝阁,大话西游3,交易平台,大话3,网易,网易游戏交易平台,网易游戏",
      "description": "网易游戏大话西游3官方线下交易平台，每一笔交易都与游戏数据对应，支持多种支付方式。买号选装备，上网易游戏藏宝阁。安全：系统监控，自动交易。方便：多种支付，立等可取",
      "title": "藏宝阁_《大话西游3》官方线下交易平台",
      // 将军令地址
      "MkeyURL": "http://mkey.163.com/download/?from=cbg-xyq",
    },
    require1('./com/com', __dirname)(false)
  );
};
