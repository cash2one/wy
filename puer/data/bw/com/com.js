'use strict';
const config = require('../../../.lib/config');
const combine = require('../../../.lib/combine');

module.exports = isLogin => {
  return combine([
    {
      ResUrl: `http://localhost:${config.PORT}`,
      ResUrlVer: `http://localhost:${config.PORT}`,
      static_version: '../',
      "CgiRootUrl": "http://zmq.cbg.dev.webapp.163.com:8103/cbg",
      ProjectNameCN: '西楚霸王',
    }],
    __dirname
  );
}
