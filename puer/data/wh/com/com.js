'use strict';
const config = require('../../../.lib/config');
const combine = require('../../../.lib/combine');

module.exports = combine([
  {
    ResUrl: `http://localhost:${config.PORT}`,
    static_version: '',
    "CgiRootUrl": "http://wh.cbg.dev.webapp.163.com:8103/cgi-bin",
  }],
  __dirname
);
