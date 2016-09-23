'use strict';
const config = require('../../../.lib/config');
const combine = require('../../../.lib/combine');

module.exports = combine([
  './server',
  {
    ResUrl: `http://localhost:${config.STATIC_PORT}`,
    static_version: '',
    // ResUrl: 'http://xyqm.cbg.dev.webapp.163.com:8105',
    // static_version: 'rc4ca36f41c8a20148c9b5',
    CgiRootUrl: 'http://xyq.cbg.163.com/cgi-bin',
    is_login: 1,
  }], 
  __dirname
);