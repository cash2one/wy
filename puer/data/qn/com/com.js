'use strict';
const config = require('../../../.lib/config');

module.exports = {
  ResUrl: `http://localhost:${config.STATIC_PORT}`,
  static_version: '',
  // ResUrl: 'http://res.qn2.cbg.163.com',
  // static_version: 'rccf418e88576fab3240b7',
  CgiRootUrl: 'http://xqn.cbg.163.com/cgi-bin',
};
