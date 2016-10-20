'use strict';
const config = require('../../../.lib/config');
const combine = require('../../../.lib/combine');

module.exports = combine([
  {
    ResUrl: `http://localhost:${config.PORT}`,
    static_version: ''
  }],
  __dirname
);
